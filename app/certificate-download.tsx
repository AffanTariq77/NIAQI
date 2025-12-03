import BackgroundGradient from '@/components/BackgroundGradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CertificateDownloadScreen = () => {
  const handleDownloadCertificate = () => {
    // Handle certificate download logic
    console.log('Downloading certificate...');
  };

  const handleLeaveFeedback = () => {
    router.push('/leave-review');
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#5B21B6" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Trophy Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="trophy" size={180} color="#5B21B6" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Congratulations!</Text>

          {/* Message */}
          <Text style={styles.message}>
            You have received a course completion certificate.
          </Text>

          {/* Download Certificate Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleDownloadCertificate}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Download Certificate</Text>
          </TouchableOpacity>

          {/* Leave Feedback Link */}
          <TouchableOpacity style={styles.linkButton} onPress={handleLeaveFeedback}>
            <Text style={styles.linkButtonText}>Leave A Feedback</Text>
          </TouchableOpacity>
        </View>
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
  },
  header: {
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#5B21B6',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 48,
    paddingHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    paddingVertical: 12,
  },
  linkButtonText: {
    color: '#5B21B6',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default CertificateDownloadScreen;

