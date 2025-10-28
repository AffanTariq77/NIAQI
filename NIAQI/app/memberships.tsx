import GradientBackground from '@/components/GradientBackground';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    price: '$199',
    oldPrice: '$299',
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
    title: 'NIAQI Basic Membership',
    price: '$199',
    oldPrice: '$299',
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
    id: '3',
    title: 'NIAQI Basic Membership',
    price: '$199',
    oldPrice: '$299',
    rating: '4.8',
    ratingCount: 234,
    features: [
      'Student Base Data',
      'Forum & Student Page',
      'Course Reminder & Discount',
      'Sponsor Discounts & Link to Landing Page',
    ],
  },
];

const MembershipsScreen = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>('1');

  const handleCardPress = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleStartNow = (membershipId: string) => {
    router.push('/cart');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
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
          {mockMemberships.map((membership) => {
            const isExpanded = expandedCard === membership.id;

            return (
              <TouchableOpacity
                key={membership.id}
                style={styles.membershipCard}
                onPress={() => handleCardPress(membership.id)}
                activeOpacity={0.9}
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
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color="#666666"
                  />
                </View>

                <Text style={styles.cardTitle}>{membership.title}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.cardPrice}>{membership.price}</Text>
                  <Text style={styles.cardOldPrice}>{membership.oldPrice}</Text>
                </View>

                {/* Expanded Content */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    {membership.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#4299E1" />
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
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
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
    fontWeight: '600',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    color: '#4299E1',
  },
  cardOldPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
  },
  startNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MembershipsScreen;

