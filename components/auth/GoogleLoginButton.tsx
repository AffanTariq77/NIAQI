import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
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

      // Get the API base URL without /api suffix
      const apiBaseUrl = API_CONFIG.BASE_URL.replace("/api", "");
      const googleAuthUrl = `${apiBaseUrl}/auth/google`;

      console.log("🔗 Opening Google OAuth URL:", googleAuthUrl);

      // Open Google OAuth flow in browser
      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        Linking.createURL("/login")
      );

      console.log("📱 Auth session result:", result);

      if (result.type === "success" && result.url) {
        // Parse the callback URL
        const url = new URL(result.url);
        const auth = url.searchParams.get("auth");
        const token = url.searchParams.get("token");
        const error = url.searchParams.get("message");

        if (auth === "success" && token) {
          console.log("✅ Google OAuth successful");
          onSuccess?.(token);
        } else if (auth === "error") {
          console.error("❌ Google OAuth error:", error);
          onError?.(error || "Authentication failed");
        }
      } else if (result.type === "cancel") {
        console.log("❌ User cancelled Google OAuth");
        onError?.("Authentication cancelled");
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
