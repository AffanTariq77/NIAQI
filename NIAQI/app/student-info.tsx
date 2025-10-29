import GradientBackground from '@/components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StudentInfoScreen = () => {
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="search" size={24} color="#333333" />
            </TouchableOpacity>
          </View>

          {/* Profile */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>M</Text>
              </View>
              <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart-outline" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.studentName}>Muhammad Ali</Text>
            <Text style={styles.studentSpecialty}>Specialty: Mold Assessment</Text>
          </View>

          {/* Experience Box */}
          <View style={styles.experienceBox}>
            <Text style={styles.experienceTitle}>15 years experience</Text>
            <Text style={styles.experienceDesc}>Expert in indoor air quality and mold assessment</Text>
          </View>

          {/* Contact Info */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color="#4299E1" />
              <Text style={styles.contactText}>+12345678</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color="#4299E1" />
              <Text style={styles.contactText}>Muhammad@gmail.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color="#4299E1" />
              <Text style={styles.contactText}>New York, NY</Text>
            </View>
          </View>

          {/* Profile Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>Profile</Text>
              <Text style={styles.detailText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>Career Path</Text>
              <Text style={styles.detailText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>Highlights</Text>
              <Text style={styles.detailText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E4ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4299E1',
  },
  heartButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  studentSpecialty: {
    fontSize: 16,
    color: '#666666',
  },
  experienceBox: {
    backgroundColor: '#4299E1',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  experienceDesc: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#333333',
  },
  detailsSection: {
    paddingHorizontal: 20,
  },
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default StudentInfoScreen;

