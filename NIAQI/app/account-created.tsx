import GradientBackground from '@/components/GradientBackground';
import PrimaryButton from '@/components/PrimaryButton';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AccountCreatedScreen = () => {
  const handleGetStarted = () => {
    // Navigate to home tab
    router.replace('/(tabs)');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Account Created!</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Your account has been created successfully.
          </Text>

          {/* Get Started Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Get Started"
              onPress={handleGetStarted}
            />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default AccountCreatedScreen;

