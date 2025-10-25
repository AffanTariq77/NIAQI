import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    // Redirect to onboarding screen
    router.replace('/onboarding');
  }, []);

  return (
    <LinearGradient
      colors={['#F0F4F8', '#E0D8F0', '#F0E8F8']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <ActivityIndicator size="large" color="#333333" />
    </LinearGradient>
  );
}
