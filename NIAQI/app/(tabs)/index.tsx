import OnboardingScreen from '@/components/onboarding-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.welcomeText}>
          Welcome to NIAQI!
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          National Indoor Air Quality Institute
        </ThemedText>
        <ThemedText style={styles.description}>
          You've completed the onboarding process. The app is now ready to use.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
});
