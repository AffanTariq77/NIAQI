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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { apiClient, Document } from "@/lib/api-client";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      Alert.alert("Error", "Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Download and open document
  const handleDownloadDocument = async (document: Document) => {
    try {
      setDownloadingId(document.id);

      const downloadUrl = apiClient.getDocumentDownloadUrl(document.id);

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

      const file = new File(Paths.document, fileName);

      // Download using fetch and write to file
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();

      await file.create();
      await file.write(new Uint8Array(buffer));

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
      Alert.alert("Sync Failed", "Unable to sync documents.");
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
      <TouchableOpacity
        style={[styles.documentCard, viewed && styles.viewedCard]}
        onPress={() => handleDownloadDocument(item)}
        disabled={downloading}
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
            <Text style={styles.metaText}>{formatDate(item.modifiedTime)}</Text>
          </View>
          {viewed && viewedDocs[item.id] && (
            <Text style={styles.viewedText}>
              Viewed {viewedDocs[item.id].viewCount} time(s)
            </Text>
          )}
        </View>

        <View style={styles.actionButton}>
          {downloading ? (
            <ActivityIndicator size="small" color="#54DAE2" />
          ) : (
            <Ionicons name="download-outline" size={24} color="#54DAE2" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Resource Library</Text>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#54DAE2" />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
    backgroundColor: "#F5F5F7",
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
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#54DAE2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  syncButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  progressCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
  },
  progressValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#54DAE2",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
  },
  progressDivider: {
    width: 1,
    backgroundColor: "#E8E8EA",
    marginHorizontal: 12,
  },
  documentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  viewedCard: {
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#9DAFFB",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  viewedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  documentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  documentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 6,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  metaDivider: {
    marginHorizontal: 6,
    color: "#CCC",
  },
  viewedText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 4,
  },
  actionButton: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  syncEmptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#54DAE2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  syncEmptyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ResourceLibraryScreen;
