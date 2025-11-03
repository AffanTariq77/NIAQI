import BackgroundGradient from '@/components/BackgroundGradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CourseReminderDiscountsScreen = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 2,
    minutes: 35,
    seconds: 55,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEnroll = () => {
    router.push('/cart');
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Course Reminder & Discounts</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Heading */}
          <View style={styles.headingSection}>
            <Text style={styles.mainHeading}>Hurrah!</Text>
            <Text style={styles.mainHeading}>Deals-2025</Text>
            <Text style={styles.mainHeading}>Starting Soon</Text>
          </View>

          {/* Countdown Timer */}
          <View style={styles.timerContainer}>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{String(timeLeft.days).padStart(2, '0')}</Text>
              <Text style={styles.timerLabel}>Days</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{String(timeLeft.hours).padStart(2, '0')}</Text>
              <Text style={styles.timerLabel}>Hours</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
              <Text style={styles.timerLabel}>Minutes</Text>
            </View>
            <View style={styles.timerBox}>
              <Text style={styles.timerNumber}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
              <Text style={styles.timerLabel}>Seconds</Text>
            </View>
          </View>

          {/* Social Proof */}
          <View style={styles.socialProofSection}>
            <Text style={styles.socialProofNumber}>25k+</Text>
            <View style={styles.avatarsContainer}>
              <View style={[styles.avatarCircle, { backgroundColor: '#FFB3D9', zIndex: 7 }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#B3D9FF', zIndex: 6, marginLeft: -10 }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#FFD4A3', zIndex: 5, marginLeft: -10 }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#C5E1A5', zIndex: 4, marginLeft: -10 }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#FFCDD2', zIndex: 3, marginLeft: -10 }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#E1BEE7', zIndex: 2, marginLeft: -10 }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#B2DFDB', zIndex: 1, marginLeft: -10 }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
            </View>
            <Text style={styles.socialProofText}>
              Students already grabbed the deals another
            </Text>
          </View>

          {/* Promo Card */}
          <View style={styles.promoCard}>
            <Text style={styles.promoDiscount}>10% off</Text>
            <Text style={styles.promoCode}>with promo code: ABC123</Text>
            <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll} activeOpacity={0.8}>
              <Text style={styles.enrollButtonText}>Enroll now</Text>
              <Ionicons name="cart-outline" size={20} color="#FFF" />
            </TouchableOpacity>
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
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
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
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headingSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    lineHeight: 38,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  timerBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  timerNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
  },
  socialProofSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  socialProofNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  avatarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  socialProofText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  promoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#B3D9FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  promoDiscount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  promoCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  enrollButton: {
    backgroundColor: '#90CAF9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  enrollButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseReminderDiscountsScreen;

