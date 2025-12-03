import BackgroundGradient from "@/components/BackgroundGradient";
import { useAuth } from "@/lib/auth-context";
import { apiClient, MembershipPlan } from "@/lib/api-client";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Membership {
  id: string;
  title: string;
  price: string;
  oldPrice: string;
  rating: string;
  ratingCount: number;
  features: string[];
  type: string;
}

const mockMemberships: Membership[] = [
  {
    id: "1",
    title: "NIAQI Basic Membership",
    price: "$99",
    oldPrice: "$199",
    rating: "4.8",
    ratingCount: 234,
    type: "BASIC",
    features: [
      "Student Base Data",
      "Forum & Student Page",
      "Course Reminder & Discount",
      "Sponsor Discounts & Link to Landing Page",
    ],
  },
  {
    id: "2",
    title: "NIAQI Premium Membership",
    price: "$198",
    oldPrice: "$299",
    rating: "4.8",
    ratingCount: 234,
    type: "PREMIUM",
    features: [
      "All items with basic",
      "Resource Library",
      "Documents & Processes",
      "Report Verbiage & Disclosures",
    ],
  },
  {
    id: "3",
    title: "NIAQI Premium Plus Membership",
    price: "$297",
    oldPrice: "$399",
    rating: "4.8",
    ratingCount: 234,
    type: "PREMIUM_PLUS",
    features: [
      "All items with basic",
      "Resource Library",
      "Documents & Processes",
      "Report Verbiage & Disclosures",
      "Software Suite",
    ],
  },
];

const convertToMembership = (plan: MembershipPlan): Membership => ({
  id: plan.id,
  title: plan.name,
  price: `$${plan.currentPrice}`,
  oldPrice: plan.oldPrice ? `$${plan.oldPrice}` : "",
  rating: "4.8",
  ratingCount: 234,
  type: plan.type,
  features: plan.features,
});

const UpgradeScreen = () => {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setIsLoading(true);
        const plans = await apiClient.getMembershipPlans();
        const convertedPlans = plans.map(convertToMembership);
        setMemberships(convertedPlans);
      } catch (error) {
        console.error("Error fetching membership plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembershipPlans();
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleSelectPlan = (membershipId: string) => {
    const selectedMembership = memberships.find((m) => m.id === membershipId);
    router.push({
      pathname: "/cart",
      params: {
        membershipId: membershipId,
        membershipTitle: selectedMembership?.title || "",
      },
    });
  };

  const handleToggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Filter out plans that are lower or equal to current membership
  const getAvailablePlans = () => {
    const currentType = user?.membershipType || "BASIC";

    if (currentType === "PREMIUM_PLUS") {
      return []; // No upgrades available
    } else if (currentType === "PREMIUM") {
      return memberships.filter((m) => m.type === "PREMIUM_PLUS");
    } else {
      return memberships.filter((m) => m.type !== "BASIC");
    }
  };

  const availablePlans = getAvailablePlans();

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upgrade Your Plan</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>
              Unlock premium features and take your experience to the next level
            </Text>
          </View>

          {/* Membership Cards */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5A7CFF" />
              <Text style={styles.loadingText}>Loading plans...</Text>
            </View>
          ) : availablePlans.length === 0 ? (
            <View style={styles.noPlansContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.noPlansTitle}>You're at the Top!</Text>
              <Text style={styles.noPlansText}>
                You already have the Premium Plus membership with all features
                unlocked.
              </Text>
            </View>
          ) : (
            availablePlans.map((membership) => (
              <View key={membership.id} style={styles.membershipCardWrapper}>
                <LinearGradient
                  colors={["#FFFFFF", "#F7F8FF", "#FDF5FA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.membershipCard}
                >
                  <TouchableOpacity
                    onPress={() => handleToggleCard(membership.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingValue}>
                          {membership.rating}
                        </Text>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Ionicons name="star-half" size={16} color="#FFD700" />
                        <Text style={styles.ratingCount}>
                          ({membership.ratingCount})
                        </Text>
                      </View>
                      <Ionicons
                        name={
                          expandedCard === membership.id
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={22}
                        color="#777"
                      />
                    </View>

                    <Text style={styles.membershipTitle}>
                      {membership.title}
                    </Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.membershipPrice}>
                        {membership.price}
                      </Text>
                      {membership.oldPrice && (
                        <Text style={styles.oldPrice}>
                          {" "}
                          / {membership.oldPrice}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {expandedCard === membership.id && (
                    <View style={styles.expandedContent}>
                      {membership.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#5A7CFF"
                          />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </LinearGradient>

                {expandedCard === membership.id && (
                  <View style={styles.selectButtonWrapper}>
                    <TouchableOpacity
                      onPress={() => handleSelectPlan(membership.id)}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={["#5A7CFF", "#7FB6FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.selectButton}
                      >
                        <Text style={styles.selectButtonText}>
                          Select Plan →
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  noPlansContainer: {
    paddingVertical: 60,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  noPlansTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginTop: 20,
    marginBottom: 10,
  },
  noPlansText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  membershipCardWrapper: {
    marginBottom: 36,
    overflow: "visible",
  },
  membershipCard: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 28,
    shadowColor: "#B3B3B3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(206, 202, 202, 0.5)",
    backgroundColor: "#FFFFFF",
    overflow: "visible",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 4,
  },
  membershipTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  membershipPrice: {
    fontSize: 24,
    fontWeight: "800",
    color: "#5A7CFF",
  },
  oldPrice: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999999",
    textDecorationLine: "line-through",
  },
  expandedContent: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(206, 202, 202, 0.3)",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  selectButtonWrapper: {
    marginTop: -18,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  selectButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5A7CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default UpgradeScreen;
