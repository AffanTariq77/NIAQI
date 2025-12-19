import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
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

      // Use custom scheme for deep linking (not Expo tunnel URL)
      // This ensures the OAuth callback works properly
      const redirectUri = "niaqi://login";
      console.log("🔙 App Redirect URL:", redirectUri);

      // Construct the OAuth URL with the redirect_uri as a query parameter
      // This tells the backend where to redirect after authentication
      const googleAuthUrl = `https://niaqi-backend.onrender.com/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

      console.log("🔗 Opening Google OAuth URL:", googleAuthUrl);

      // Open Google OAuth flow in browser
      // Flow: /api/auth/google → Google → /callback → HTML bridge → niaqi://login?token=...
      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        redirectUri
      );

      console.log("📱 Auth session result:", result);

      if (result.type === "success" && result.url) {
        // Parse the callback URL from the HTML bridge
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    // Remove elevation to avoid weird shadow on transparent background
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
