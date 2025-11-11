import BackgroundGradient from '@/components/BackgroundGradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

type CartItem = {
  id: string;
  title: string;
  currentPrice: number;
  oldPrice?: number;
};

const getItemPrice = (membershipId: string): { currentPrice: number; oldPrice: number } => {
  switch (membershipId) {
    case '1':
      return { currentPrice: 99, oldPrice: 199 };
    case '2':
      return { currentPrice: 198, oldPrice: 299 };
    case '3':
      return { currentPrice: 297, oldPrice: 399 };
    default:
      return { currentPrice: 99, oldPrice: 199 };
  }
};

const CartScreen = () => {
  const params = useLocalSearchParams();
  const swipeRefs = useRef<Record<string, Swipeable | null>>({});
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Initialize cart with selected membership
    if (params.membershipId && params.membershipTitle) {
      const prices = getItemPrice(params.membershipId as string);
      setItems([{
        id: params.membershipId as string,
        title: params.membershipTitle as string,
        currentPrice: prices.currentPrice,
        oldPrice: prices.oldPrice,
      }]);
    }
  }, [params.membershipId, params.membershipTitle]);

  const itemCost = items.reduce((sum, it) => sum + it.currentPrice, 0);
  const discount = 0;
  const totalPrice = itemCost - discount;

  const handleCheckout = () => {
    router.push('/membership-details');
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  // Gmail-style swipe-to-delete background
  const renderRightActions = (id: string) => {
    return (
      <View style={styles.swipeBackground}>
        <TouchableOpacity onPress={() => handleDelete(id)} activeOpacity={0.8} style={styles.deleteButtonAnimated}>
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Scroll content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.itemsCountText}>Items in cart: {items.length}</Text>

          {items.map((item) => (
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
                    <Text style={styles.currentPrice}>${item.currentPrice}</Text>
                    <Text style={styles.slashText}> / </Text>
                    <Text style={styles.oldPrice}>${item.oldPrice}</Text>
                  </Text>
                </View>
              </View>
            </Swipeable>
          ))}
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

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} activeOpacity={0.8}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  backgroundFlip: { flex: 1, transform: [{ rotate: '180deg' }] },
  safeArea: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 8,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', textAlign: 'center', color: '#111' },

  scrollContent: { paddingBottom: 180 },
  itemsCountText: { fontSize: 16, color: '#111', marginBottom: 16, fontWeight: '600' },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
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
    backgroundColor: '#F5F5F7',
  },
  imagePlaceholder: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#E8E8EA',
  },
  itemContent: { flex: 1, justifyContent: 'center' },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  currentPrice: { fontSize: 13, color: '#5A7CFF', fontWeight: '600' },
  slashText: { color: '#8E8E93', fontSize: 13 },
  oldPrice: { color: '#8E8E93', fontSize: 13, textDecorationLine: 'line-through' },

  swipeBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 16,
    marginBottom: 16,
    paddingRight: 24,
    backgroundColor: '#000000',
  },
  deleteButtonAnimated: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },

  bottomArea: { paddingBottom: 24 },
  summaryBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: '500', color: '#333' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#E5E5E5', paddingTop: 10, marginTop: 6 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#111' },
  totalValue: { fontSize: 16, fontWeight: '700', color: '#111' },

  checkoutButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CartScreen;
