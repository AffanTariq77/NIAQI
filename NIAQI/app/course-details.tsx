import GradientBackground from '@/components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CourseDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState<'lesson' | 'reviews'>('lesson');
  const [isFavorite, setIsFavorite] = useState(false);

  const lessons = [
    { id: '1', title: 'Welcome to the Course', content: 'Our team is pleased to welcome you to our session!', duration: '5min 23s', completed: true },
    { id: '2', title: 'What To Bring', content: 'We will be inside of a conference room. Please remember to bring a jacket if you get cool easily.', duration: '8min 45s', completed: true },
    { id: '3', title: 'Introducing to The Class', content: 'Get to know your classmates and instructors.', duration: '10min 34s', completed: false },
    { id: '4', title: 'Course Overview', content: 'Overview of what you will learn in this course.', duration: '12min 15s', completed: false },
  ];

  const reviews = [
    { id: '1', name: 'Ben Parker', rating: 5, date: '12 Feb 2022', comment: 'The explanation is very easy to understand, really cool, understandable.' },
    { id: '2', name: 'Jen Maria', rating: 5, date: '15 Feb 2022', comment: 'Great course! Well structured and informative.' },
    { id: '3', name: 'John Doe', rating: 5, date: '20 Feb 2022', comment: 'Excellent content and delivery by the instructor.' },
    { id: '4', name: 'Sarah Smith', rating: 5, date: '25 Feb 2022', comment: 'Really helpful for my career development.' },
  ];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Wildwood - Advanced Air Qual..
          </Text>
          <TouchableOpacity 
            onPress={() => setIsFavorite(!isFavorite)} 
            style={styles.headerButton}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF3B30" : "#333333"} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Course Banner */}
          <View style={styles.banner}>
            <LinearGradient
              colors={['#4299E1', '#63B3ED', '#90CDF4']}
              style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerLogo}>NIAQI</Text>
                <Text style={styles.bannerTitle}>ADVANCED INDOOR AIR QUALITY FOR MOLD ASSESSORS AND REMEDIATORS Plus 1 Exam</Text>
                <Text style={styles.bannerSubtitle}>IN PERSON SESSION & EXAM</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Course Info */}
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>
              Wildwood - Advanced Indoor Air Quality For Mold Assessors And Remediators
            </Text>
            
            <View style={styles.instructorInfo}>
              <View style={styles.instructorAvatar}>
                <Text style={styles.instructorInitial}>H</Text>
              </View>
              <View style={styles.instructorDetails}>
                <Text style={styles.instructorLabel}>Instructor</Text>
                <Text style={styles.instructorName}>Heather Delaporte</Text>
                <Text style={styles.instructorRating}>5.0 ⭐</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'lesson' && styles.tabActive]}
              onPress={() => setActiveTab('lesson')}
            >
              <Text style={[styles.tabText, activeTab === 'lesson' && styles.tabTextActive]}>
                Lesson
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
              onPress={() => setActiveTab('reviews')}
            >
              <Text style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'lesson' ? (
            <View style={styles.lessonContent}>
              <Text style={styles.sectionTitle}>Section 1 - Introductions</Text>
              {lessons.map((lesson) => (
                <View key={lesson.id} style={styles.lessonCard}>
                  <View style={styles.lessonHeader}>
                    <View style={styles.lessonIcon}>
                      {lesson.completed ? (
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                      ) : (
                        <Ionicons name="play-circle-outline" size={24} color="#4299E1" />
                      )}
                    </View>
                    <View style={styles.lessonInfo}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      <Text style={styles.lessonContent}>{lesson.content}</Text>
                      <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.reviewsContent}>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewInitial}>{review.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <View style={styles.stars}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons key={i} name="star" size={14} color="#FFC107" />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.totalPrice}>Total Price $199</Text>
          <TouchableOpacity 
            style={styles.enrollButton}
            onPress={() => router.push('/course-completion')}
          >
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    paddingVertical: 12,
  },
  headerButton: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  banner: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerGradient: {
    padding: 20,
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerLogo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  courseInfo: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E4ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructorInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4299E1',
  },
  instructorDetails: {
    flex: 1,
  },
  instructorLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  instructorRating: {
    fontSize: 14,
    color: '#666666',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#4299E1',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#4299E1',
  },
  lessonContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  lessonCard: {
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
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lessonIcon: {
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  lessonContent: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#999999',
  },
  reviewsContent: {
    paddingHorizontal: 20,
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E4ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4299E1',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewComment: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  enrollButton: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  enrollButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseDetailsScreen;

