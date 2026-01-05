import BackgroundGradient from "@/components/BackgroundGradient";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { getKajabiProducts } from "@/lib/kajabi-client";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Course {
  id: string;
  location: string;
  title: string;
  thumbnail?: any;
  type: "in-person" | "exam" | "virtual" | "pre-recorded" | "kajabi";
  source?: "local" | "kajabi";
  description?: string;
}

// Start with empty local courses — we'll display Kajabi products or server results only
const courses: Course[] = [];

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [kajabiItems, setKajabiItems] = useState<Course[]>([]);
  const [results, setResults] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const kajabi = await getKajabiProducts();
        if (!mounted || !kajabi) return;
        const mapped = kajabi.map((p) => ({
          id: `kajabi-${p.id}`,
          location: "Kajabi",
          title: p.title,
          description: p.description,
          type: "kajabi" as const,
          source: "kajabi" as const,
          thumbnail: (p as any).thumbnail_url
            ? { uri: (p as any).thumbnail_url }
            : (p as any).thumbnailUrl
            ? { uri: (p as any).thumbnailUrl }
            : (p as any).thumbnail
            ? { uri: (p as any).thumbnail }
            : undefined,
        }));
        setKajabiItems(mapped);
      } catch (e) {
        console.warn("Failed to load Kajabi products in search", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Merge local + Kajabi and filter client-side
  useEffect(() => {
    const merged = [...courses, ...kajabiItems];
    const q = searchText.trim().toLowerCase();
    if (!q) {
      setResults(merged);
      return;
    }

    const filtered = merged.filter((c) => {
      if (!c) return false;
      const parts = [c.title || "", c.location || "", c.description || ""]
        .join(" ")
        .toLowerCase();
      return parts.includes(q);
    });
    setResults(filtered);
  }, [searchText, kajabiItems]);

  const renderIcon = (type: string) => {
    switch (type) {
      case "in-person":
      case "exam":
        return <Ionicons name="people-outline" size={24} color="#666" />;
      case "virtual":
      case "pre-recorded":
        return <Ionicons name="videocam-outline" size={24} color="#666" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>

      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Course List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <View style={{ padding: 24, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#5A7CFF" />
            </View>
          )}

          {!isLoading && results.length === 0 && (
            <View style={{ padding: 24, alignItems: "center" }}>
              <Text style={{ color: "#666" }}>No results found</Text>
            </View>
          )}

          {!isLoading &&
            results.length > 0 &&
            results.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                activeOpacity={0.8}
                onPress={() => router.push("/course-details")}
              >
                <View style={styles.courseContent}>
                  {/* Thumbnail */}
                  <View style={styles.thumbnailContainer}>
                    {course.thumbnail ? (
                      <Image
                        source={course.thumbnail}
                        style={styles.thumbnail}
                        contentFit="cover"
                        cachePolicy="memory-disk"
                        priority="high"
                        transition={150}
                      />
                    ) : (
                      <View style={styles.thumbnailPlaceholder} />
                    )}
                  </View>

                  {/* Course Info */}
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseLocation}>{course.location}</Text>
                    <Text style={styles.courseTitle} numberOfLines={2}>
                      {course.title}
                    </Text>
                    {course.description ? (
                      <Text
                        style={{ fontSize: 12, color: "#999", marginTop: 6 }}
                        numberOfLines={2}
                      >
                        {course.description}
                      </Text>
                    ) : null}
                  </View>

                  {/* Source badge for Kajabi items */}
                  {course.source === "kajabi" && (
                    <View style={styles.kajabiBadge}>
                      <Text style={styles.kajabiBadgeText}>Kajabi</Text>
                    </View>
                  )}

                  {/* Type Icon */}
                  <View style={styles.iconContainer}>
                    {renderIcon(course.type)}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    transform: [{ rotate: "180deg" }],
  },
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 180,
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  courseContent: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    marginRight: 14,
    borderRadius: 12,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E8E8EA",
    borderRadius: 12,
  },
  courseInfo: {
    flex: 1,
    paddingRight: 10,
  },
  courseLocation: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#666",
    lineHeight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  kajabiBadge: {
    backgroundColor: "#F0F6FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "center",
    marginRight: 8,
  },
  kajabiBadgeText: {
    color: "#5A7CFF",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default SearchScreen;
