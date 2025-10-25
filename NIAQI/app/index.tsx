import { Redirect } from 'expo-router';

export default function Index() {
  // Use Redirect component instead of router.replace for better compatibility
  return <Redirect href="/onboarding" />;
}
