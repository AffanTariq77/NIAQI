import BackgroundGradient from '@/components/BackgroundGradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Course {
  id: string;
  location: string;
  title: string;
  thumbnail?: any;
  type: 'in-person' | 'exam' | 'virtual' | 'pre-recorded';
}

const courses: Course[] = [
  {
    id: '1',
    location: 'WILDWOOD',
    title: 'ADVANCED INDOOR AIR QUALITY FOR MOLD ASSESSORS AND REMEDIATORS',
    thumbnail: require('../../assets/logo.png'),
    type: 'in-person',
  },
  {
    id: '2',
    location: 'LICENSURE EXAM',
    title: 'MOLD REMEDIATION OR ASSESSORS',
    thumbnail: require('../../assets/logo.png'),
    type: 'exam',
  },
  {
    id: '3',
    location: 'PRE-RECORDED',
    title: 'ADVANCED INDOOR AIR QUALITY FOR MOLD ASSESSORS AND REMEDIATORS + Exam 1',
    type: 'pre-recorded',
  },
  {
    id: '4',
    location: 'VIRTUAL',
    title: 'ADVANCED INDOOR AIR QUALITY FOR MOLD ASSESSORS AND REMEDIATORS + Exam 11',
    type: 'virtual',
  },
  {
    id: '5',
    location: 'LICENSURE EXAM',
    title: 'MOLD REMEDIATION AND ASSESSORS',
    thumbnail: require('../../assets/logo.png'),
    type: 'in-person',
  },
  {
    id: '6',
    location: 'Pre-Recorded',
    title: 'Advanced Indoor Air Quality For Mold Assessors and Mold Remediators',
    type: 'pre-recorded',
  },
];

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');

  const renderIcon = (type: string) => {
    switch (type) {
      case 'in-person':
      case 'exam':
        return <Ionicons name="people-outline" size={24} color="#666" />;
      case 'virtual':
      case 'pre-recorded':
        return <Ionicons name="videocam-outline" size={24} color="#666" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Course List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {courses.map((course) => (
            <TouchableOpacity 
              key={course.id} 
              style={styles.courseCard} 
              activeOpacity={0.8}
              onPress={() => router.push('/course-details')}
            >
              <View style={styles.courseContent}>
                {/* Thumbnail */}
                <View style={styles.thumbnailContainer}>
                  {course.thumbnail ? (
                    <Image 
                      source={course.thumbnail} 
                      style={styles.thumbnail} 
                      contentFit="cover"
                      cachePolicy="memory-disk"
                      priority="high"
                      transition={150}
                    />
                  ) : (
                    <View style={styles.thumbnailPlaceholder} />
                  )}
                </View>

                {/* Course Info */}
                <View style={styles.courseInfo}>
                  <Text style={styles.courseLocation}>{course.location}</Text>
                  <Text style={styles.courseTitle} numberOfLines={2}>
                    {course.title}
                  </Text>
                </View>

                {/* Type Icon */}
                <View style={styles.iconContainer}>{renderIcon(course.type)}</View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    transform: [{ rotate: '180deg' }],
  },
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 180,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  courseContent: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    marginRight: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8EA',
    borderRadius: 12,
  },
  courseInfo: {
    flex: 1,
    paddingRight: 10,
  },
  courseLocation: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  courseTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
    lineHeight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
