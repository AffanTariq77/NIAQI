import BackgroundGradient from "@/components/BackgroundGradient";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getKajabiCustomer, KajabiCustomer } from "@/lib/kajabi-client";
import { ActivityIndicator } from "react-native";

const StudentInfoScreen = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const params = useLocalSearchParams();
  const studentId = params?.id as string | undefined;
  const [customer, setCustomer] = useState<KajabiCustomer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!studentId) return;
      setLoading(true);
      setError(null);
      try {
        // If the id was prefixed with 'kajabi-' when mapped, strip prefix
        const realId = studentId.startsWith("kajabi-")
          ? studentId.replace(/^kajabi-/, "")
          : studentId;
        const res = await getKajabiCustomer(realId);
        if (!mounted) return;
        if (res) setCustomer(res);
        else setError("Customer not found");
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load customer");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [studentId]);

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundFlip}>
          <BackgroundGradient />
        </View>
      </View>

      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Info</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Profile Card */}
          <LinearGradient
            colors={["#E8EEFF", "#F3E9FF", "#FDE7F4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            {/* Top Row: Profile Image and Right Content */}
            <View style={styles.topRow}>
              {/* Profile Image */}
              <View style={styles.profileImageContainer}>
                <Image
                  source={require("../assets/student1.png")}
                  style={styles.profileImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  priority="high"
                  transition={200}
                />
              </View>

              {/* Right Side Content */}
              <View style={styles.rightContent}>
                {/* Experience Badge */}
                <View style={styles.experienceBadge}>
                  <Ionicons name="ribbon" size={14} color="#007AFF" />
                  <Text style={styles.experienceText}>15 years experience</Text>
                </View>

                {/* Description Box */}
                <View style={styles.descriptionBox}>
                  <Text style={styles.descriptionText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Text>
                </View>
              </View>
            </View>

            {/* Student Name, ID and Specialty */}
            <View style={styles.nameSection}>
              <Text style={styles.studentName}>
                {customer?.name || "Student Name"}
              </Text>
              {studentId ? (
                <Text
                  style={[
                    styles.studentSpecialty,
                    { fontSize: 12, color: "#666", marginTop: 4 },
                  ]}
                >
                  ID: {studentId}
                </Text>
              ) : null}
              <Text style={styles.studentSpecialty}>
                {customer?.public_location || "Speciality"}
              </Text>
            </View>

            {/* Contact Information */}
            <View style={styles.contactSection}>
              {loading ? (
                <ActivityIndicator size="small" color="#2E57E8" />
              ) : error ? (
                <Text style={[styles.contactText, { color: "#D0021B" }]}>
                  {error}
                </Text>
              ) : (
                <>
                  <Text style={styles.contactText}>
                    Contact Number: {customer?.public_location || "+N/A"}
                  </Text>
                  <Text style={styles.contactText}>
                    Email: {customer?.email || "N/A"}
                  </Text>
                </>
              )}
            </View>

            {/* Heart Icon */}
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={28}
                color={isFavorite ? "#FF3B30" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </LinearGradient>

          {/* Profile Section */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.sectionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>

          {/* Career Path Section */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Career Path</Text>
            <Text style={styles.sectionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>

          {/* Highlights Section */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            <Text style={styles.sectionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>
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
  },
  backgroundFlip: {
    flex: 1,
    transform: [{ rotate: "180deg" }],
  },
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 180,
  },

  /** Profile Card **/
  profileCard: {
    borderRadius: 25,
    padding: 20,
    marginBottom: 28,
    backgroundColor: "#DDACE5",
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderColor: "rgb(61, 58, 58)",
    elevation: 6,
    marginTop: 10,
    position: "relative",
  },

  /** Top Row (Image + Right content) **/
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  rightContent: {
    flex: 1,
    marginLeft: 16,
  },

  /** Experience Badge **/
  experienceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E57E8",
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  experienceText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
  },

  /** Description box **/
  descriptionBox: {
    backgroundColor: "#2E57E8",
    borderRadius: 20,
    padding: 10,
  },
  descriptionText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 16,
  },

  /** Name Section **/
  nameSection: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E57E8",
    marginBottom: 3,
  },
  studentSpecialty: {
    fontSize: 13,
    color: "#888",
  },

  /** Contact Info **/
  contactSection: {
    alignItems: "center",
    marginBottom: 6,
  },
  contactText: {
    fontSize: 12,
    color: "#4A5D9C",
  },

  /** Heart Icon **/
  heartButton: {
    position: "absolute",
    bottom: 18,
    right: 18,
    backgroundColor: "rgba(212, 203, 203, 0.37)",
    borderRadius: 50,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  /** Detail Sections **/
  detailSection: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E57E8",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: "#3A3A3A",
    lineHeight: 20,
  },
});

export default StudentInfoScreen;
