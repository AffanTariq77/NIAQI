import BackgroundGradient from "@/components/BackgroundGradient";
import { useAuth } from "@/lib/auth-context";
import { apiClient, MembershipPlan } from "@/lib/api-client";
import { getKajabiCourses } from '@/lib/kajabi-client';
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurMask, Canvas, Circle } from "@shopify/react-native-skia";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import type { ViewToken } from "react-native";
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface NextClassCard {
  id: string;
  title: string;
  description: string;
}

const nextClassCards: NextClassCard[] = [
  {
    id: "1",
    title: "Next Class - 27-29 August",
    description:
      "Online And On-Site Training & CE For Mold Assessors And Remediators",
  },
  {
    id: "2",
    title: "Next Class - 3-5 September",
    description:
      "Advanced Indoor Air Quality Assessment & Remediation Techniques",
  },
  {
    id: "3",
    title: "Next Class - 10-12 September",
    description: "Comprehensive Mold Inspector Certification Course & Training",
  },
];

interface Membership {
  id: string;
  title: string;
  price: string;
  oldPrice: string;
  rating: string;
  ratingCount: number;
  features: string[];
}

// Mock data as fallback
const mockMemberships: Membership[] = [
  {
    id: "1",
    title: "NIAQI Basic Membership",
    price: "$99",
    oldPrice: "$199",
    rating: "4.8",
    ratingCount: 234,
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
    features: [
      "All items with basic",
      "Resource Library",
      "Documents & Processes",
      "Report Verbiage & Disclosures",
    ],
  },
];

// Helper function to convert MembershipPlan to Membership
const convertToMembership = (plan: MembershipPlan): Membership => ({
  id: plan.id,
  title: plan.name,
  price: `$${plan.currentPrice}`,
  oldPrice: plan.oldPrice ? `$${plan.oldPrice}` : "",
  rating: "4.8",
  ratingCount: 234,
  features: plan.features,
});

interface CourseCardProps {
  membership: Membership;
  isExpanded: boolean;
  onToggle: () => void;
  onStartNow: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  membership,
  isExpanded,
  onToggle,
  onStartNow,
}) => (
  <View style={{ marginBottom: isExpanded ? 36 : 16, overflow: "visible" }}>
    <View style={{ overflow: "visible" }}>
      <LinearGradient
        colors={["#FFFFFF", "#F7F8FF", "#FDF5FA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.courseCard}
      >
        <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
          <View style={styles.cardHeader}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>{membership.rating}</Text>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star" size={16} color="#FFD700" />
              <Ionicons name="star-half" size={16} color="#FFD700" />
              <Text style={styles.ratingCount}>({membership.ratingCount})</Text>
            </View>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="#777"
            />
          </View>

          <Text style={styles.courseTitle}>{membership.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.coursePrice}>{membership.price}</Text>
            {membership.oldPrice && (
              <Text style={styles.oldPrice}> / {membership.oldPrice}</Text>
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {membership.features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color="#5A7CFF" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>

      {isExpanded && (
        <View style={styles.startNowWrapper}>
          <TouchableOpacity onPress={onStartNow} activeOpacity={0.9}>
            <LinearGradient
              colors={["#5A7CFF", "#7FB6FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startNowButton}
            >
              <Text style={styles.startNowText}>Start Now →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

const HomeScreen = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>("1"); // Expand first card (Basic) by default
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);
  const [isLoadingMemberships, setIsLoadingMemberships] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Animated values for pagination dashes
  const dash1Opacity = useSharedValue(1);
  const dash2Opacity = useSharedValue(0.3);
  const dash3Opacity = useSharedValue(0.3);
  const dash1Width = useSharedValue(32);
  const dash2Width = useSharedValue(24);
  const dash3Width = useSharedValue(24);

  // Refresh user data when home screen mounts
  useEffect(() => {
    // Small delay to ensure sign-in/sign-up process completes
    const timer = setTimeout(() => {
      console.log("🏠 Home screen: Checking authentication...");
      console.log("🏠 Current user state:", user);
      console.log("🏠 isAuthenticated:", isAuthenticated);

      // Only refresh if user is already authenticated
      if (isAuthenticated && user && user.id) {
        console.log("🏠 User authenticated, refreshing data...");
        refreshUser();
      } else {
        console.log("🏠 User not authenticated yet, skipping refresh");
      }
    }, 500); // Reduced to 500ms for faster response

    return () => clearTimeout(timer);
  }, [isAuthenticated, user?.id]); // Depend on both isAuthenticated and user.id

  // Fetch membership plans from API
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setIsLoadingMemberships(true);
        const plans = await apiClient.getMembershipPlans();

        // Convert API plans to Membership format
        let convertedPlans = plans.map(convertToMembership);

        // Filter out memberships that are lower than or equal to user's current membership
        if (user?.membershipType) {
          const membershipHierarchy = {
            BASIC: 1,
            PREMIUM: 2,
            PREMIUM_PLUS: 3,
          };

          const currentLevel =
            membershipHierarchy[
              user.membershipType as keyof typeof membershipHierarchy
            ] || 0;

          convertedPlans = convertedPlans.filter((plan) => {
            // Extract membership type from plan title
            let planType = "BASIC";
            if (plan.title.includes("Premium Plus")) {
              planType = "PREMIUM_PLUS";
            } else if (plan.title.includes("Premium")) {
              planType = "PREMIUM";
            }

            const planLevel =
              membershipHierarchy[
                planType as keyof typeof membershipHierarchy
              ] || 0;

            // Only show plans higher than current membership
            return planLevel > currentLevel;
          });
        }

        setMemberships(convertedPlans);

        console.log("✅ Loaded membership plans from API:", convertedPlans);
        // Also fetch Kajabi courses and append as additional offers (non-destructive)
        try {
          const kajabi = await getKajabiCourses();
          if (kajabi && kajabi.length) {
            console.log('✅ Kajabi courses loaded:', kajabi.length);
            const extra = kajabi.map((c: any, idx: number) => ({
              id: `kajabi-${c.id}-${idx}`,
              title: c.title,
              currentPrice: 0,
              oldPrice: null,
              features: [c.description || 'Kajabi course'],
            }));
            setMemberships((prev) => [...prev, ...extra]);
          }
        } catch (e) {
          console.warn('Failed to load Kajabi courses', e);
        }
      } catch (error) {
        console.error("❌ Error fetching membership plans:", error);
        console.log("Using mock data as fallback");
        // Keep using mock data if API fails
      } finally {
        setIsLoadingMemberships(false);
      }
    };

    fetchMembershipPlans();
  }, [user?.membershipType]); // Re-fetch when membership type changes

  const handleToggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleStartNow = (membershipId: string) => {
    const selectedMembership = memberships.find((m) => m.id === membershipId);
    console.log("🛒 START NOW CLICKED:");
    console.log("  - Membership ID:", membershipId);
    console.log("  - Selected Membership:", selectedMembership);
    console.log("  - User authenticated:", !!user);
    console.log("  - isAuthenticated:", isAuthenticated);
    console.log("  - User object:", user);

    // Check if user is authenticated using isAuthenticated flag (more reliable)
    if (!isAuthenticated || !user) {
      console.log("  - User not authenticated, redirecting to login");
      router.push({
        pathname: "/login",
        params: {
          redirect: "/cart",
          membershipId: membershipId,
          membershipTitle: selectedMembership?.title || "",
        },
      });
      return;
    }

    console.log("  - Navigating to cart with params:", {
      membershipId,
      membershipTitle: selectedMembership?.title || "",
    });

    router.push({
      pathname: "/cart",
      params: {
        membershipId: membershipId,
        membershipTitle: selectedMembership?.title || "",
      },
    });
  };

  const animatePaginationDashes = (newIndex: number) => {
    // Reset all dashes
    dash1Opacity.value = withTiming(0.3, { duration: 200 });
    dash2Opacity.value = withTiming(0.3, { duration: 200 });
    dash3Opacity.value = withTiming(0.3, { duration: 200 });

    dash1Width.value = withTiming(24, { duration: 200 });
    dash2Width.value = withTiming(24, { duration: 200 });
    dash3Width.value = withTiming(24, { duration: 200 });

    // Animate active dash
    setTimeout(() => {
      if (newIndex === 0) {
        dash1Opacity.value = withTiming(1, { duration: 200 });
        dash1Width.value = withTiming(32, { duration: 200 });
      } else if (newIndex === 1) {
        dash2Opacity.value = withTiming(1, { duration: 200 });
        dash2Width.value = withTiming(32, { duration: 200 });
      } else if (newIndex === 2) {
        dash3Opacity.value = withTiming(1, { duration: 200 });
        dash3Width.value = withTiming(32, { duration: 200 });
      }
    }, 100);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index || 0;
        setActiveCardIndex(newIndex);
        animatePaginationDashes(newIndex);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Animated styles for dashes
  const dash1Style = useAnimatedStyle(() => ({
    width: dash1Width.value,
    opacity: dash1Opacity.value,
  }));

  const dash2Style = useAnimatedStyle(() => ({
    width: dash2Width.value,
    opacity: dash2Opacity.value,
  }));

  const dash3Style = useAnimatedStyle(() => ({
    width: dash3Width.value,
    opacity: dash3Opacity.value,
  }));

  const renderNextClassCard = ({ item }: { item: NextClassCard }) => (
    <View style={styles.nextClassCardWrapper}>
      <View style={styles.nextClassCard}>
        <LinearGradient
          colors={["#4299E1", "#63B3ED"]}
          style={styles.nextClassGradient}
        >
          {/* Decorative circles with blur */}
          {Platform.OS === "web" ? (
            <>
              <View
                style={
                  {
                    position: "absolute",
                    filter: "blur(50px)",
                    WebkitFilter: "blur(50px)",
                  } as any
                }
              >
                <View style={styles.decorCircleBlue} />
              </View>
              <View
                style={
                  {
                    position: "absolute",
                    filter: "blur(75px)",
                    WebkitFilter: "blur(75px)",
                  } as any
                }
              >
                <View style={styles.decorCirclePurple} />
              </View>
            </>
          ) : (
            <Canvas style={styles.nextClassCanvas} pointerEvents="none">
              {/* Blue blurred circle */}
              <Circle cx={12.5} cy={9} r={60} color="#9BC1FB">
                <BlurMask blur={35} style="normal" />
              </Circle>
              {/* Purple blurred circle */}
              <Circle cx={27.5} cy={3} r={62} color="#8774FE">
                <BlurMask blur={50} style="normal" />
              </Circle>
            </Canvas>
          )}

          {/* Background image on the right */}
          <ExpoImage
            source={require("../../assets/mould2.png")}
            style={styles.nextClassImage}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
            transition={150}
          />
          <View style={styles.nextClassContent}>
            <View style={styles.nextClassTextContainer}>
              <Text style={styles.nextClassLabel}>{item.title}</Text>
              <Text style={styles.nextClassTitle}>{item.description}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundFlip}>
          <BackgroundGradient />
        </View>
      </View>

      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.userName}>
                  {user?.name || "Loading..."}
                </Text>
              </View>

              <View style={styles.profileImageContainer}>
                <View style={styles.profileImage}>
                  <Ionicons name="person" size={24} color="#333333" />
                </View>
              </View>
            </View>

            {/* Gradient Search Bar */}
            <LinearGradient
              colors={["#F3E9FF", "#E8EEFF", "#FDE7F4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.searchContainer}
            >
              <Feather name="search" size={18} color="#555" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#555"
                value={searchText}
                onChangeText={setSearchText}
              />
            </LinearGradient>
          </View>

          {/* Next Class Cards Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={nextClassCards}
              renderItem={renderNextClassCard}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={SCREEN_WIDTH}
              decelerationRate="fast"
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
            />

            {/* Pagination Dashes */}
            <View style={styles.paginationContainer}>
              <Animated.View style={[styles.paginationDash, dash1Style]} />
              <Animated.View style={[styles.paginationDash, dash2Style]} />
              <Animated.View style={[styles.paginationDash, dash3Style]} />
            </View>
          </View>

          {/* My Courses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {user?.membershipType ? "Your Membership" : "Choose Your Plan"}
            </Text>

            {user?.membershipType ? (
              // User has a membership - show their current plan
              <View style={styles.currentMembershipCard}>
                <View style={styles.currentMembershipHeader}>
                  <View style={styles.currentMembershipBadge}>
                    <Ionicons
                      name={
                        user.membershipType === "PREMIUM_PLUS"
                          ? "diamond"
                          : user.membershipType === "PREMIUM"
                          ? "star"
                          : "checkmark-circle"
                      }
                      size={24}
                      color={
                        user.membershipType === "PREMIUM_PLUS"
                          ? "#FFD700"
                          : user.membershipType === "PREMIUM"
                          ? "#5A7CFF"
                          : "#10B981"
                      }
                    />
                  </View>
                  <View style={styles.currentMembershipInfo}>
                    <Text style={styles.currentMembershipLabel}>
                      Active Plan
                    </Text>
                    <Text style={styles.currentMembershipName}>
                      {user.membershipType === "PREMIUM_PLUS"
                        ? "Premium Plus"
                        : user.membershipType === "PREMIUM"
                        ? "Premium"
                        : "Basic"}{" "}
                      Membership
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewBenefitsButton}
                  onPress={() =>
                    router.push({
                      pathname: "/membership-details",
                      params: { membershipType: user.membershipType },
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewBenefitsButtonText}>
                    View Benefits
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#5A7CFF" />
                </TouchableOpacity>

                {user.membershipType !== "PREMIUM_PLUS" && (
                  <TouchableOpacity
                    style={styles.upgradeNowButton}
                    onPress={() => router.push("/upgrade")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.upgradeNowButtonText}>
                      {user.membershipType === "BASIC"
                        ? "Upgrade to Premium"
                        : "Upgrade to Premium Plus"}
                    </Text>
                    <Ionicons name="arrow-up" size={16} color="#FFF" />
                  </TouchableOpacity>
                )}
              </View>
            ) : null}

            {/* Show available upgrades or all plans */}
            {isLoadingMemberships ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5A7CFF" />
                <Text style={styles.loadingText}>Loading memberships...</Text>
              </View>
            ) : memberships.length > 0 ? (
              <>
                {user?.membershipType && (
                  <Text style={styles.upgradeSectionTitle}>
                    Available Upgrades
                  </Text>
                )}
                {memberships.map((membership) => (
                  <CourseCard
                    key={membership.id}
                    membership={membership}
                    isExpanded={expandedCard === membership.id}
                    onToggle={() => handleToggleCard(membership.id)}
                    onStartNow={() => handleStartNow(membership.id)}
                  />
                ))}
              </>
            ) : user?.membershipType === "PREMIUM_PLUS" ? (
              <View style={styles.maxTierContainer}>
                <Ionicons name="trophy" size={48} color="#FFD700" />
                <Text style={styles.maxTierTitle}>You're at the Top! 🎉</Text>
                <Text style={styles.maxTierDescription}>
                  You have the highest membership tier with access to all
                  premium features and benefits.
                </Text>
              </View>
            ) : null}
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
  container: { flex: 1, zIndex: 1, backgroundColor: "transparent" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 180 },

  // Welcome Card
  welcomeCard: {
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#C8D8FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(221, 208, 208, 0.7)",
    backgroundColor: "#FFFFFF",
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  welcomeTextContainer: { flexDirection: "column" },
  welcomeText: { fontSize: 16, fontWeight: "600", color: "#1E1E1E" },
  userName: { fontSize: 20, fontWeight: "700", color: "#000" },
  profileImageContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#D2EBFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A7C9FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(206, 198, 198, 0.8)",
    shadowColor: "#E4E4E4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },

  // Next Class Carousel
  carouselContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  nextClassCardWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 16,
  },
  nextClassCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 215,
  },

  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },
  paginationDash: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#1C1C1E",
  },
  nextClassGradient: {
    padding: 20,
    height: 220,
  },
  nextClassCanvas: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  nextClassContent: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between",
  },
  nextClassTextContainer: {
    flex: 1,
    marginTop: 40,
  },
  nextClassLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  nextClassTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    lineHeight: 26,
    paddingRight: 50,
  },
  nextClassImage: {
    position: "absolute",
    right: -10,
    top: -10,
    width: 150,
    height: 120,
    opacity: 0.4,
  },

  // Decorative circles (approximation of provided specs)
  decorCircleBlue: {
    position: "absolute",
    backgroundColor: "#9BC1FB",
    width: 119,
    height: 116,
    borderRadius: 60,
    top: -49,
    left: -47,
    opacity: 0.7,
    transform: [{ rotate: "-90deg" }],
  },
  decorCirclePurple: {
    position: "absolute",
    backgroundColor: "#8774FE",
    width: 125,
    height: 114,
    borderRadius: 62,
    top: -54,
    left: -35,
    opacity: 1,
  },

  // My Courses
  section: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },

  currentMembershipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#B3B3B3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(206, 202, 202, 0.5)",
  },
  currentMembershipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  currentMembershipBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F7F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  currentMembershipInfo: {
    flex: 1,
  },
  currentMembershipLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  currentMembershipName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  viewBenefitsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#5A7CFF",
    marginBottom: 12,
    gap: 6,
  },
  viewBenefitsButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5A7CFF",
  },
  upgradeNowButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#5A7CFF",
    gap: 6,
  },
  upgradeNowButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },

  courseCard: {
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
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  ratingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginRight: 4,
  },
  ratingCount: { fontSize: 13, color: "#777777", marginLeft: 4 },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  coursePrice: { fontSize: 15, fontWeight: "600", color: "#5A7CFF" },
  oldPrice: {
    fontSize: 13,
    fontWeight: "400",
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E4E4E4",
  },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  featureText: { fontSize: 14, color: "#333333", marginLeft: 10 },
  startNowWrapper: {
    position: "absolute",
    bottom: -22,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  startNowButton: {
    paddingVertical: 14,
    paddingHorizontal: 52,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5A7CFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  startNowText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  upgradeSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 16,
  },
  maxTierContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  maxTierTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  maxTierDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default HomeScreen;
