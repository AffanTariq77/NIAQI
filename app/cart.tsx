import BackgroundGradient from "@/components/BackgroundGradient";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth-context";
import { apiClient, MembershipPlan } from "@/lib/api-client";
import Toast from "react-native-toast-message";
import { useStripe } from "@stripe/stripe-react-native";

type CartItem = {
  id: string;
  title: string;
  currentPrice: number;
  oldPrice?: number;
  membershipPlanId: string;
  quantity: number;
};

const CartScreen = () => {
  const params = useLocalSearchParams();
  const swipeRefs = useRef<Record<string, Swipeable | null>>({});
  const hasProcessedParams = useRef(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshUser, user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      console.log("❌ User not authenticated, redirecting to login");
      router.replace({
        pathname: "/login",
        params: {
          redirect: "/cart",
          membershipId: params.membershipId as string,
          membershipTitle: params.membershipTitle as string,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  useEffect(() => {
    // Add to cart if membership selected (only once)
    console.log("🛒 CART SCREEN - Received params:", params);
    console.log("  - membershipId:", params.membershipId);
    console.log("  - membershipTitle:", params.membershipTitle);
    console.log("  - isLoading:", isLoading);
    console.log("  - hasProcessedParams:", hasProcessedParams.current);

    if (
      params.membershipId &&
      params.membershipTitle &&
      !isLoading &&
      !hasProcessedParams.current
    ) {
      console.log("✅ Conditions met, adding to cart...");
      hasProcessedParams.current = true;
      addMembershipToCart(
        params.membershipId as string,
        params.membershipTitle as string
      );
    } else {
      console.log("❌ Conditions NOT met:", {
        hasMembershipId: !!params.membershipId,
        hasMembershipTitle: !!params.membershipTitle,
        isLoading,
        hasProcessedParams: hasProcessedParams.current,
      });
    }
  }, [params.membershipId, params.membershipTitle, isLoading]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const cart = await apiClient.getCart();

      const cartItems: CartItem[] = cart.items.map((item) => ({
        id: item.id,
        title: item.membershipPlan.name,
        currentPrice: item.price,
        oldPrice: item.membershipPlan.oldPrice || undefined,
        membershipPlanId: item.membershipPlanId,
        quantity: item.quantity,
      }));

      setItems(cartItems);
    } catch (error: any) {
      console.error("Error loading cart:", error);
      // Cart might be empty or not created yet
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addMembershipToCart = async (membershipId: string, title: string) => {
    try {
      console.log("📦 ADD TO CART FUNCTION CALLED:");
      console.log("  - membershipId:", membershipId);
      console.log("  - title:", title);

      setIsProcessing(true);

      // Add to cart via API (backend will handle tier replacement)
      console.log("📤 Calling API to add to cart...");
      await apiClient.addToCart(membershipId, 1);
      console.log("✅ API call successful");

      // Reload cart
      console.log("🔄 Reloading cart...");
      await loadCart();

      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `${title} has been added to your cart.`,
        position: "top",
      });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add item to cart. Please try again.",
        position: "top",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const itemCost = items.reduce(
    (sum, it) => sum + it.currentPrice * it.quantity,
    0
  );
  const discount = 0;
  const totalPrice = itemCost - discount;

  const handleCheckout = async () => {
    if (items.length === 0) {
      Toast.show({
        type: "error",
        text1: "Cart Empty",
        text2: "Please add items to your cart before checking out.",
        position: "top",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log("� Starting Stripe checkout...");

      // Step 1: Create payment intent from backend
      const { clientSecret, paymentIntentId } =
        await apiClient.createPaymentIntent();
      console.log("✅ Payment Intent created:", paymentIntentId);

      // Step 2: Initialize Stripe Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "NIAQI",
        returnURL: "niaqi://stripe-redirect",
        defaultBillingDetails: {
          name: user?.name,
          email: user?.email,
        },
      });

      if (initError) {
        console.error("❌ Error initializing payment sheet:", initError);
        throw new Error(initError.message);
      }

      console.log("✅ Payment sheet initialized");

      // Step 3: Present Payment Sheet to user
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        // User cancelled or error occurred
        console.log("❌ Payment cancelled or failed:", paymentError);
        Toast.show({
          type: "error",
          text1: "Payment Cancelled",
          text2: paymentError.message || "Payment was not completed.",
          position: "top",
        });
        return;
      }

      console.log("✅ Payment successful! Verifying...");

      // Step 4: Verify payment on backend and create order
      const order = await apiClient.verifyPayment(paymentIntentId);
      console.log("✅ Order created:", order);

      // Step 5: Refresh user data to get updated membership
      await refreshUser();
      console.log("✅ User context refreshed with updated membership");

      // Step 6: Show success message
      Toast.show({
        type: "success",
        text1: "Payment Successful! 🎉",
        text2: `Your ${items[0]?.title} membership is now active!`,
        position: "top",
        visibilityTime: 3000,
      });

      // Step 7: Navigate to home to see updated membership
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 2000);
    } catch (error: any) {
      console.error("❌ Checkout error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      Toast.show({
        type: "error",
        text1: "Checkout Failed",
        text2:
          error.response?.data?.message ||
          error.message ||
          "Please check your connection and try again.",
        position: "top",
        visibilityTime: 4000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.removeFromCart(id);
      setItems((prev) => prev.filter((it) => it.id !== id));

      Toast.show({
        type: "success",
        text1: "Removed",
        text2: "Item removed from cart.",
        position: "top",
      });
    } catch (error: any) {
      console.error("Error removing item:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to remove item. Please try again.",
        position: "top",
      });
    }
  };

  // Gmail-style swipe-to-delete background
  const renderRightActions = (id: string) => {
    return (
      <View style={styles.swipeBackground}>
        <TouchableOpacity
          onPress={() => handleDelete(id)}
          activeOpacity={0.8}
          style={styles.deleteButtonAnimated}
        >
          <Ionicons name="trash-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundFlip}>
          <BackgroundGradient />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Loading state */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Loading cart...</Text>
          </View>
        ) : (
          <>
            {/* Scroll content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.itemsCountText}>
                Items in cart: {items.length}
              </Text>

              {items.length === 0 ? (
                <View style={styles.emptyCart}>
                  <Ionicons name="cart-outline" size={80} color="#CCC" />
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                  <Text style={styles.emptyCartSubtext}>
                    Add membership plans to get started
                  </Text>
                </View>
              ) : (
                items.map((item) => (
                  <Swipeable
                    key={item.id}
                    ref={(ref) => {
                      swipeRefs.current[item.id] = ref;
                    }}
                    renderRightActions={() => renderRightActions(item.id)}
                    overshootRight={false}
                    friction={1.5}
                    overshootFriction={8}
                    enableTrackpadTwoFingerGesture={false}
                    rightThreshold={80}
                    onSwipeableRightOpen={() => {
                      // Delete immediately on full swipe
                      handleDelete(item.id);
                    }}
                  >
                    <View style={styles.cartItem}>
                      <View style={styles.imageBox}>
                        <View style={styles.imagePlaceholder} />
                      </View>
                      <View style={styles.itemContent}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.priceRow}>
                          <Text style={styles.currentPrice}>
                            ${item.currentPrice}
                          </Text>
                          {item.oldPrice && (
                            <>
                              <Text style={styles.slashText}> / </Text>
                              <Text style={styles.oldPrice}>
                                ${item.oldPrice}
                              </Text>
                            </>
                          )}
                        </Text>
                        {item.quantity > 1 && (
                          <Text style={styles.quantityText}>
                            Quantity: {item.quantity}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Swipeable>
                ))
              )}
            </ScrollView>

            {/* Bottom summary */}
            <View style={styles.bottomArea}>
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Item Cost</Text>
                  <Text style={styles.summaryValue}>${itemCost}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={styles.summaryValue}>${discount}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Price</Text>
                  <Text style={styles.totalValue}>${totalPrice}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkoutButton,
                  (isProcessing || items.length === 0) &&
                    styles.checkoutButtonDisabled,
                ]}
                onPress={handleCheckout}
                activeOpacity={0.8}
                disabled={isProcessing || items.length === 0}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.checkoutText}>Checkout</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundFlip: { flex: 1, transform: [{ rotate: "180deg" }] },
  safeArea: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },

  scrollContent: { paddingBottom: 180 },
  itemsCountText: {
    fontSize: 16,
    color: "#111",
    marginBottom: 16,
    fontWeight: "600",
  },

  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 24,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },

  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageBox: {
    width: 70,
    height: 70,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
  },
  imagePlaceholder: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#E8E8EA",
  },
  itemContent: { flex: 1, justifyContent: "center" },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  priceRow: { flexDirection: "row", alignItems: "center" },
  currentPrice: { fontSize: 13, color: "#5A7CFF", fontWeight: "600" },
  slashText: { color: "#8E8E93", fontSize: 13 },
  oldPrice: {
    color: "#8E8E93",
    fontSize: 13,
    textDecorationLine: "line-through",
  },
  quantityText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  swipeBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    borderRadius: 16,
    marginBottom: 16,
    paddingRight: 24,
    backgroundColor: "#000000",
  },
  deleteButtonAnimated: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },

  bottomArea: { paddingBottom: 24 },
  summaryBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: "#666" },
  summaryValue: { fontSize: 14, fontWeight: "500", color: "#333" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 10,
    marginTop: 6,
  },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#111" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#111" },

  checkoutButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.6,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default CartScreen;
