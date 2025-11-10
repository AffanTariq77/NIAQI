import BackgroundGradient from '@/components/BackgroundGradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeaveReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // Handle review submission
    console.log('Rating:', rating, 'Comment:', comment);
    router.back();
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#5B21B6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave A Review</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Please Rate The Course!</Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={48}
                  color="#5B21B6"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your comments and suggestions help us imprave the service quality better!
          </Text>

          {/* Comment Input */}
          <TextInput
            style={styles.commentInput}
            placeholder="Enter your comment"
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
    color: '#5B21B6',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 180,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 32,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#5B21B6',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    minHeight: 140,
    fontSize: 15,
    color: '#333',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LeaveReviewScreen;
