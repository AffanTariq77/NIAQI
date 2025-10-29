import BackgroundGradient from '@/components/BackgroundGradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Membership {
  id: string;
  title: string;
  price: string;
  oldPrice: string;
  rating: string;
  ratingCount: number;
  features: string[];
}

const mockMemberships: Membership[] = [
  {
    id: '1',
    title: 'NIAQI Basic Membership',
    price: '$$$ $$$',
    oldPrice: '',
    rating: '4.8',
    ratingCount: 234,
    features: [
      'Student Base Data',
      'Forum & Student Page',
      'Course Reminder & Discount',
      'Sponsor Discounts & Link to Landing Page',
    ],
  },
  {
    id: '2',
    title: 'NIAQI Premium Membership',
    price: '$$$ $$$',
    oldPrice: '',
    rating: '4.8',
    ratingCount: 234,
    features: [
      'All items with basic',
      'Resource Library',
      'Documents & Processes',
      'Report Verbiage & Disclosures',
    ],
  },
  {
    id: '3',
    title: 'NIAQI Premium Membership',
    price: '$$$ $$$',
    oldPrice: '',
    rating: '4.8',
    ratingCount: 234,
    features: [
      'All items with basic',
      'Resource Library',
      'Documents & Processes',
      'Report Verbiage & Disclosures',
    ],
  },
];

const MembershipsScreen = () => {
  const handleStartNow = (membershipId: string) => {
    router.push('/membership-details');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>
      <SafeAreaView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Memberships</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mockMemberships.map((membership) => (
            <View
              key={membership.id}
              style={styles.membershipCard}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderContent}>
                  <Text style={styles.cardRating}>{membership.rating}</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome
                        key={star}
                        name="star"
                        size={14}
                        color="#FFC107"
                      />
                    ))}
                  </View>
                  <Text style={styles.ratingCount}>({membership.ratingCount})</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{membership.title}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.cardPrice}>{membership.price}</Text>
                {membership.oldPrice && (
                  <Text style={styles.cardOldPrice}>{membership.oldPrice}</Text>
                )}
              </View>

              {/* Features */}
              <View style={styles.featuresContent}>
                {membership.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={20} color="#007BFF" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                
                <TouchableOpacity
                  style={styles.startNowButton}
                  onPress={() => handleStartNow(membership.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startNowText}>Start Now →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
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
  membershipCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingCount: {
    fontSize: 14,
    color: '#666666',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  cardOldPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  featuresContent: {
    marginTop: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
  },
  startNowButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MembershipsScreen;

