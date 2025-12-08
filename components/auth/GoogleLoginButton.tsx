import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { API_CONFIG } from "@/lib/config";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

interface GoogleLoginButtonProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
  style?: any;
}

// Complete web browser authentication sessions
WebBrowser.maybeCompleteAuthSession();

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  style,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);

      // For mobile OAuth, we use localhost in the browser URL
      // because the browser (Chrome Custom Tab) runs on the host, not in the emulator
      // The app itself uses 10.0.2.2, but the browser uses localhost
      const googleAuthUrl =
        Platform.OS === "android"
          ? "http://localhost:5000/api/auth/google" // Browser on host can use localhost
          : `${API_CONFIG.BASE_URL.replace("/api", "")}/api/auth/google`;

      console.log("🔗 Opening Google OAuth URL:", googleAuthUrl);

      // Create the redirect URL using the app scheme (niaqi://)
      const redirectUrl = Linking.createURL("/login");
      console.log("🔙 Redirect URL:", redirectUrl);

      // Open Google OAuth flow in browser
      // This will open Safari/Chrome, backend redirects to Google,
      // Google redirects back to backend callback,
      // Backend redirects to niaqi://login?auth=success&token=...
      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        redirectUrl
      );

      console.log("📱 Auth session result:", result);

      if (result.type === "success" && result.url) {
        // Parse the callback URL from backend
        const url = new URL(result.url);
        const auth = url.searchParams.get("auth");
        const token = url.searchParams.get("token");
        const refreshToken = url.searchParams.get("refreshToken");
        const error = url.searchParams.get("message");

        if (auth === "success" && token) {
          console.log("✅ Google OAuth successful, token received");
          onSuccess?.(token);
        } else if (auth === "error") {
          console.error("❌ Google OAuth error:", error);
          onError?.(error || "Authentication failed");
        } else {
          console.warn("⚠️ Unexpected auth result:", { auth, token });
          onError?.("Unexpected authentication response");
        }
      } else if (result.type === "cancel") {
        console.log("❌ User cancelled Google OAuth");
        onError?.("Authentication cancelled");
      } else {
        console.log("❌ Auth session dismissed");
        onError?.("Authentication session closed");
      }
    } catch (error: any) {
      console.error("❌ Google OAuth error:", error);
      onError?.(error?.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.googleButton, style]}
      onPress={handleGoogleSignIn}
      activeOpacity={0.8}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#000000" size="small" />
      ) : (
        <>
          <View style={styles.googleIconContainer}>
            <Image
              source={require("../../assets/google.png")}
              style={styles.googleIconImage}
            />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    elevation: 3,
  },
  googleIconContainer: {
    marginRight: 12,
  },
  googleIconImage: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});
