import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/lib/auth-context";
import { STRIPE_CONFIG } from "@/lib/config";

// Conditionally import Stripe only on native platforms
let StripeProvider: any = ({ children }: { children: React.ReactNode }) =>
  children;
if (Platform.OS !== "web") {
  const Stripe = require("@stripe/stripe-react-native");
  StripeProvider = Stripe.StripeProvider;
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const AppContent = (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgot-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reset-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="password-reset-done"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="account-created"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen
            name="membership-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="course-details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="course-completion"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="certificate-download"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="leave-review" options={{ headerShown: false }} />
          <Stack.Screen
            name="student-base-data"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="student-info" options={{ headerShown: false }} />
          <Stack.Screen
            name="forum-student-page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="course-reminder-discounts"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="sponsor-discounts"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="upgrade" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {Platform.OS !== "web" ? (
        <StripeProvider
          publishableKey={STRIPE_CONFIG.PUBLISHABLE_KEY}
          merchantIdentifier={STRIPE_CONFIG.MERCHANT_NAME}
          urlScheme="niaqi"
        >
          {AppContent}
        </StripeProvider>
      ) : (
        AppContent
      )}
    </GestureHandlerRootView>
  );
}
