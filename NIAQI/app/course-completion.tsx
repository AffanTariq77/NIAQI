import GradientBackground from '@/components/GradientBackground';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CourseCompletionScreen = () => {
  const handleDownloadCertificate = () => {
    // Handle certificate download
    console.log('Downloading certificate...');
  };

  const handleLeaveFeedback = () => {
    router.push('/leave-review');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Trophy Icon */}
          <View style={styles.trophyContainer}>
            <LinearGradient
              colors={['#4299E1', '#63B3ED', '#90CDF4']}
              style={styles.trophy}
            >
              <Ionicons name="trophy" size={80} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>Congratulations!</Text>

          {/* Message */}
          <Text style={styles.message}>
            You have successfully completed the course! We wish you new victories, participation and success in all your endeavors!
          </Text>

          {/* Download Certificate Button */}
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={handleDownloadCertificate}
            activeOpacity={0.8}
          >
            <Text style={styles.downloadButtonText}>Download Certificate</Text>
          </TouchableOpacity>

          {/* Leave Feedback Link */}
          <TouchableOpacity 
            style={styles.feedbackLink}
            onPress={handleLeaveFeedback}
          >
            <Text style={styles.feedbackLinkText}>Leave Feedback</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyContainer: {
    marginBottom: 32,
  },
  trophy: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  downloadButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackLink: {
    paddingVertical: 8,
  },
  feedbackLinkText: {
    color: '#4299E1',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CourseCompletionScreen;

