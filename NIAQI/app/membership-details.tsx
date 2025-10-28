import GradientBackground from '@/components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Feature {
  id: string;
  title: string;
  unlocked: boolean;
  gradient: string[];
  icon: string;
}

const features: Feature[] = [
  {
    id: '1',
    title: 'Student Base Data',
    unlocked: true,
    gradient: ['#F8E7EF', '#E4ECFF'],
    icon: '🔍',
  },
  {
    id: '2',
    title: 'Forum & Student Page',
    unlocked: true,
    gradient: ['#E4ECFF', '#F0F0FF'],
    icon: '💬',
  },
  {
    id: '3',
    title: 'Course Reminder & Discount',
    unlocked: true,
    gradient: ['#D1E7DD', '#B3E5FC'],
    icon: '📧',
  },
  {
    id: '4',
    title: 'Sponsor Discounts & Link To Landing Page',
    unlocked: true,
    gradient: ['#FFE5E5', '#FFF0E5'],
    icon: '🎁',
  },
  {
    id: '5',
    title: 'Resource Library',
    unlocked: false,
    gradient: ['#F0F0FF', '#E4ECFF'],
    icon: '📚',
  },
  {
    id: '6',
    title: 'Documents & Processes',
    unlocked: false,
    gradient: ['#F0E4FF', '#E4ECFF'],
    icon: '📄',
  },
  {
    id: '7',
    title: 'Report Verbiage & Disclosure',
    unlocked: false,
    gradient: ['#FFE5E5', '#F0E4FF'],
    icon: '📋',
  },
  {
    id: '8',
    title: 'Software Suite',
    unlocked: false,
    gradient: ['#E4ECFF', '#D1E7DD'],
    icon: '💻',
  },
];

const MembershipDetailsScreen = () => {
  const handleFeaturePress = (feature: Feature) => {
    if (feature.id === '1') {
      router.push('/student-base-data');
    }
    // Add navigation for other features as needed
  };

  const renderFeatureCard = (feature: Feature) => (
    <TouchableOpacity
      key={feature.id}
      style={[
        styles.featureCard,
        !feature.unlocked && styles.featureCardLocked,
      ]}
      disabled={!feature.unlocked}
      activeOpacity={0.8}
      onPress={() => handleFeaturePress(feature)}
    >
      <LinearGradient
        colors={feature.gradient}
        style={styles.featureGradient}
      >
        <Text style={styles.featureIcon}>{feature.icon}</Text>
        <Text style={styles.featureTitle}>{feature.title}</Text>
      </LinearGradient>

      {!feature.unlocked && (
        <View style={styles.lockOverlay}>
          <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Basic Membership</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Two-column grid layout */}
          <View style={styles.gridContainer}>
            {features.map(renderFeatureCard)}
          </View>
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
    paddingBottom: 40,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    height: 160,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureCardLocked: {
    opacity: 0.6,
  },
  featureGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
});

export default MembershipDetailsScreen;

