import { useAuth } from '@/lib/auth-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CourseCardProps {
  title: string;
  price: string;
  oldPrice?: string;
  rating: string;
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, price, oldPrice, rating, onPress }) => (
  <TouchableOpacity 
    style={styles.courseCard}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.courseHeader}>
      <View style={styles.courseInfo}>
        <Text style={styles.courseTitle}>{title}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.coursePrice}>{price}</Text>
          {oldPrice && <Text style={styles.courseOldPrice}>{oldPrice}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-down-outline" size={24} color="#666666" />
    </View>
    <View style={styles.ratingRow}>
      <Text style={styles.ratingText}>{rating}</Text>
    </View>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <LinearGradient
          colors={['#E4ECFF', '#F8E7EF', '#FFFFFF']}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Ionicons name="person" size={24} color="#333333" />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Next Class Card */}
        <TouchableOpacity 
          style={styles.nextClassCard}
          onPress={() => router.push('/course-details')}
        >
          <LinearGradient
            colors={['#4299E1', '#63B3ED']}
            style={styles.nextClassGradient}
          >
            <View style={styles.nextClassContent}>
              <View style={styles.nextClassTextContainer}>
                <Text style={styles.nextClassLabel}>Next Class</Text>
                <Text style={styles.nextClassTitle}>Indoor Air Quality Fundamentals</Text>
                <Text style={styles.nextClassTime}>Today at 2:00 PM</Text>
              </View>
              <Ionicons name="arrow-forward-circle" size={32} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* My Courses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          
          <CourseCard
            title="NIAQI Basic Membership"
            price="$129"
            oldPrice="$199"
            rating="4.8 ⭐ (234)"
            onPress={() => router.push('/memberships')}
          />
          
          <CourseCard
            title="NIAQI Basic Membership"
            price="$129"
            oldPrice="$199"
            rating="4.8 ⭐ (234)"
            onPress={() => router.push('/memberships')}
          />
          
          <CourseCard
            title="NIAQI Basic Membership"
            price="$129"
            oldPrice="$199"
            rating="4.8 ⭐ (234)"
            onPress={() => router.push('/memberships')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: '#666666',
  },
  profileImageContainer: {
    marginLeft: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  nextClassCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nextClassGradient: {
    padding: 20,
  },
  nextClassContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextClassTextContainer: {
    flex: 1,
  },
  nextClassLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  nextClassTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  nextClassTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coursePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4299E1',
    marginRight: 8,
  },
  courseOldPrice: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default HomeScreen;
