import BackgroundGradient from '@/components/BackgroundGradient';
import { useAuth } from '@/lib/auth-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BlurMask, Canvas, Circle } from '@shopify/react-native-skia';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
    price: '$99',
    oldPrice: '$199',
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
    price: '$198',
    oldPrice: '$299',
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
    title: 'NIAQI Premium Plus Membership',
    price: '$297',
    oldPrice: '$399',
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
  <View style={{ marginBottom: isExpanded ? 36 : 16, overflow: 'visible' }}>
    <View style={{ overflow: 'visible' }}>
      <LinearGradient
        colors={['#FFFFFF', '#F7F8FF', '#FDF5FA']}
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
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
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
              colors={['#5A7CFF', '#7FB6FF']}
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
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleToggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleStartNow = (membershipId: string) => {
    const selectedMembership = mockMemberships.find(m => m.id === membershipId);
    router.push({
      pathname: '/cart',
      params: { 
        membershipId: membershipId,
        membershipTitle: selectedMembership?.title || '',
      }
    });
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <View style={styles.backgroundFlip}>
          <BackgroundGradient />
        </View>
      </View>

      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Card */}
          <View
            style={styles.welcomeCard}
          >
            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.userName}>
                  {user?.name || 'Heather Delaporte'}
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
              colors={['#F3E9FF', '#E8EEFF', '#FDE7F4']}
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

          {/* Next Class Card */}
          <View style={styles.nextClassCard}>
            <LinearGradient
              colors={['#4299E1', '#63B3ED']}
              style={styles.nextClassGradient}
            >
              {/* Decorative circles with blur */}
              {Platform.OS === 'web' ? (
                <>
                  <View style={{ position: 'absolute', filter: 'blur(50px)', WebkitFilter: 'blur(50px)' } as any}>
                    <View style={styles.decorCircleBlue} />
                  </View>
                  <View style={{ position: 'absolute', filter: 'blur(75px)', WebkitFilter: 'blur(75px)' } as any}>
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
                source={require('../../assets/mould2.png')}
                style={styles.nextClassImage}
                contentFit="contain"
                cachePolicy="memory-disk"
                priority="high"
                transition={150}
              />
              <View style={styles.nextClassContent}>
                <View style={styles.nextClassTextContainer}>
                  <Text style={styles.nextClassLabel}>Next Class</Text>
                  <Text style={styles.nextClassTitle}>
                    Indoor Air Quality Fundamentals
                  </Text>
                  <Text style={styles.nextClassTime}>Today at 2:00 PM</Text>
                </View>
                <Ionicons name="arrow-forward-circle" size={32} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </View>

          {/* My Courses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Courses</Text>
            {mockMemberships.map((membership) => (
              <CourseCard
                key={membership.id}
                membership={membership}
                isExpanded={expandedCard === membership.id}
                onToggle={() => handleToggleCard(membership.id)}
                onStartNow={() => handleStartNow(membership.id)}
              />
            ))}
          </View>
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
  },
  backgroundFlip: {
    flex: 1,
    transform: [{ rotate: '180deg' }],
  },
  container: { flex: 1, zIndex: 1, backgroundColor: 'transparent' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 180 },

  // Welcome Card
  welcomeCard: {
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#C8D8FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(221, 208, 208, 0.7)',
    backgroundColor: '#FFFFFF',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  welcomeTextContainer: { flexDirection: 'column' },
  welcomeText: { fontSize: 16, fontWeight: '600', color: '#1E1E1E' },
  userName: { fontSize: 20, fontWeight: '700', color: '#000' },
  profileImageContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#D2EBFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A7C9FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(206, 198, 198, 0.8)',
    shadowColor: '#E4E4E4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },

  // Next Class
  nextClassCard: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  nextClassGradient: { padding: 20 },
  nextClassCanvas: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  nextClassContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextClassTextContainer: { flex: 1 },
  nextClassLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  nextClassTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  nextClassTime: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  nextClassImage: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 150,
    height: 120,
    opacity: 0.9,
  },

  // Decorative circles (approximation of provided specs)
  decorCircleBlue: {
    position: 'absolute',
    backgroundColor: '#9BC1FB',
    width: 119,
    height: 116,
    borderRadius: 60,
    top: -49,
    left: -47,
    opacity: 0.7,
    transform: [{ rotate: '-90deg' }],
  },
  decorCirclePurple: {
    position: 'absolute',
    backgroundColor: '#8774FE',
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
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },

  courseCard: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 28,
    shadowColor: '#B3B3B3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(206, 202, 202, 0.5)',
    backgroundColor: '#FFFFFF',
    overflow: 'visible',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingValue: { fontSize: 14, fontWeight: '600', color: '#333333', marginRight: 4 },
  ratingCount: { fontSize: 13, color: '#777777', marginLeft: 4 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  coursePrice: { fontSize: 15, fontWeight: '600', color: '#5A7CFF' },
  oldPrice: { fontSize: 13, fontWeight: '400', color: '#8E8E93', textDecorationLine: 'line-through' },
  expandedContent: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureText: { fontSize: 14, color: '#333333', marginLeft: 10 },
  startNowWrapper: {
    position: 'absolute',
    bottom: -22,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startNowButton: {
    paddingVertical: 14,
    paddingHorizontal: 52,
    borderRadius: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A7CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  startNowText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});

export default HomeScreen;
