import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { apiClient, Document } from "@/lib/api-client";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundGradient from "@/components/BackgroundGradient";

const STORAGE_KEY = "viewed_documents";

interface ViewedDocuments {
  [documentId: string]: {
    viewedAt: string;
    viewCount: number;
  };
}

const ResourceLibraryScreen = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewedDocs, setViewedDocs] = useState<ViewedDocuments>({});

  // Load viewed documents from storage
  const loadViewedDocuments = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setViewedDocs(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load viewed documents:", error);
    }
  };

  // Mark document as viewed
  const markAsViewed = async (documentId: string) => {
    try {
      const updated: ViewedDocuments = {
        ...viewedDocs,
        [documentId]: {
          viewedAt: new Date().toISOString(),
          viewCount: (viewedDocs[documentId]?.viewCount || 0) + 1,
        },
      };
      setViewedDocs(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to mark as viewed:", error);
    }
  };

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      const response = await apiClient.getDocuments();
      if (response.success) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      // Don't show error alert for now - documents may not be synced yet
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Download and open document
  const handleDownloadDocument = async (document: Document) => {
    try {
      setDownloadingId(document.id);

      const downloadUrl = await apiClient.getDocumentDownloadUrl(document.id);

      // Determine file extension
      let fileExtension = ".pdf"; // Default to PDF
      if (document.mimeType.includes("image")) {
        fileExtension = ".jpg";
      } else if (document.mimeType.includes("text")) {
        fileExtension = ".txt";
      }

      const fileName = document.name.includes(".")
        ? document.name
        : `${document.name}${fileExtension}`;

      // Create a file reference using the new API
      const file = new File(Paths.document, fileName);

      // Download the file
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      // Get the file as a blob
      const blob = await response.blob();

      // Create the file
      await file.create();

      // Convert blob to ArrayBuffer and write using a Promise
      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
          try {
            const arrayBuffer = reader.result as ArrayBuffer;
            await file.write(new Uint8Array(arrayBuffer));

            console.log("✅ Document downloaded to:", file.uri);

            // Mark as viewed
            await markAsViewed(document.id);

            // Share/Open the file
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(file.uri, {
                mimeType: document.mimeType,
                dialogTitle: "Open Document",
                UTI: document.mimeType,
              });
            } else {
              Alert.alert("Success", "Document downloaded successfully!", [
                { text: "OK" },
              ]);
            }

            resolve();
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };

        reader.readAsArrayBuffer(blob);
      });
    } catch (error) {
      console.error("Failed to download document:", error);
      Alert.alert(
        "Download Failed",
        "Unable to download the document. Please try again."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // Preview document in browser/viewer
  const handlePreviewDocument = async (document: Document) => {
    try {
      // Mark as viewed
      await markAsViewed(document.id);

      const downloadUrl = await apiClient.getDocumentDownloadUrl(document.id);

      // For images and PDFs, try to open in browser
      if (
        document.mimeType.includes("image") ||
        document.mimeType.includes("pdf")
      ) {
        await WebBrowser.openBrowserAsync(downloadUrl);
      } else {
        // For other types, prompt to download
        Alert.alert(
          "Preview Not Available",
          "Would you like to download this document?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Download",
              onPress: () => handleDownloadDocument(document),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Failed to preview document:", error);
      Alert.alert(
        "Preview Failed",
        "Unable to preview the document. Try downloading instead."
      );
    }
  };

  // Trigger sync from backend
  const handleSync = async () => {
    try {
      setRefreshing(true);
      const result = await apiClient.triggerDocumentSync();

      if (result.success) {
        Alert.alert(
          "Sync Complete",
          `${result.newFiles} new, ${result.updatedFiles} updated, ${result.skippedFiles} unchanged`
        );
        await fetchDocuments();
      }
    } catch (error) {
      console.error("Sync failed:", error);
      Alert.alert(
        "Sync Failed",
        "Unable to sync documents. Make sure Google Drive is configured properly."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDocuments();
  }, []);

  useEffect(() => {
    loadViewedDocuments();
    fetchDocuments();
  }, []);

  // Get icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) {
      return "document-text";
    } else if (mimeType.includes("image")) {
      return "image";
    } else if (mimeType.includes("video")) {
      return "videocam";
    } else if (mimeType.includes("sheet") || mimeType.includes("excel")) {
      return "grid";
    } else if (
      mimeType.includes("presentation") ||
      mimeType.includes("powerpoint")
    ) {
      return "easel";
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return "document";
    }
    return "document-attach";
  };

  // Get file size in readable format
  const formatFileSize = (bytes: string | null) => {
    if (!bytes) return "Unknown size";
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if document is viewed
  const isViewed = (documentId: string) => {
    return !!viewedDocs[documentId];
  };

  const renderDocument = ({ item }: { item: Document }) => {
    const viewed = isViewed(item.id);
    const downloading = downloadingId === item.id;

    return (
      <View style={[styles.documentCard, viewed && styles.viewedCard]}>
        <TouchableOpacity
          style={styles.documentMainContent}
          onPress={() => handlePreviewDocument(item)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={getFileIcon(item.mimeType) as any}
              size={32}
              color={viewed ? "#9DAFFB" : "#54DAE2"}
            />
            {viewed && (
              <View style={styles.viewedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
            )}
          </View>

          <View style={styles.documentInfo}>
            <Text style={styles.documentName} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{formatFileSize(item.size)}</Text>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.metaText}>
                {formatDate(item.modifiedTime)}
              </Text>
            </View>
            {viewed && viewedDocs[item.id] && (
              <Text style={styles.viewedText}>
                Viewed {viewedDocs[item.id].viewCount} time(s)
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handlePreviewDocument(item)}
            disabled={downloading}
          >
            <Ionicons name="eye-outline" size={22} color="#9DAFFB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDownloadDocument(item)}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#54DAE2" />
            ) : (
              <Ionicons name="download-outline" size={22} color="#54DAE2" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerSubtitle}>
            {documents.length} document{documents.length !== 1 ? "s" : ""}{" "}
            available
          </Text>
        </View>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleSync}
          disabled={refreshing}
        >
          <Ionicons name="sync" size={20} color="#FFF" />
          <Text style={styles.syncButtonText}>Sync</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Summary */}
      <View style={styles.progressCard}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>{documents.length}</Text>
          <Text style={styles.progressLabel}>Total</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>
            {Object.keys(viewedDocs).length}
          </Text>
          <Text style={styles.progressLabel}>Viewed</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>
            {documents.length - Object.keys(viewedDocs).length}
          </Text>
          <Text style={styles.progressLabel}>Remaining</Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No Documents Found</Text>
      <Text style={styles.emptyText}>
        Documents from Google Drive will appear here.
      </Text>
      <TouchableOpacity style={styles.syncEmptyButton} onPress={handleSync}>
        <Ionicons name="sync" size={20} color="#FFF" />
        <Text style={styles.syncEmptyButtonText}>Sync Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <BackgroundGradient />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#54DAE2" />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <BackgroundGradient />

      {/* Header with back button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Resource Library</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#54DAE2"]}
            tintColor="#54DAE2"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#54DAE2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 6,
    shadowColor: "#54DAE2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  syncButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  progressCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
  },
  progressValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#54DAE2",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  progressDivider: {
    width: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 12,
  },
  documentCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  viewedCard: {
    backgroundColor: "rgba(157, 175, 251, 0.15)",
    borderWidth: 1.5,
    borderColor: "#9DAFFB",
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(84, 218, 226, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    position: "relative",
  },
  viewedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  documentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  documentMainContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  documentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  metaDivider: {
    marginHorizontal: 6,
    color: "#CCC",
  },
  viewedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "rgba(157, 175, 251, 0.1)",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  syncEmptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#54DAE2",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
    shadowColor: "#54DAE2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  syncEmptyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ResourceLibraryScreen;
