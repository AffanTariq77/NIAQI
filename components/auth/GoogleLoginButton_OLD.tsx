import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { API_CONFIG } from "@/lib/config";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
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

      // Create the redirect URL - Expo AuthSession will handle the proper format
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'niaqi',
        path: 'login'
      });

      console.log("� Redirect URL:", redirectUri);

      // Use production backend URL for Google OAuth
      const googleAuthUrl = `https://niaqi-backend.onrender.com/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

      console.log("� Opening Google OAuth URL:", googleAuthUrl);

      // Open Google OAuth flow in browser using AuthSession
      // AuthSession properly handles the OAuth callback
      const result = await AuthSession.startAsync({
        authUrl: googleAuthUrl,
        returnUrl: redirectUri,
      });

      console.log("📱 Auth session result:", result);

      if (result.type === "success" && result.params) {
        const { auth, token, refreshToken, message } = result.params;

        if (auth === "success" && token) {
          console.log("✅ Google OAuth successful, token received");
          onSuccess?.(token);
        } else if (auth === "error") {
          console.error("❌ Google OAuth error:", message);
          onError?.(message || "Authentication failed");
        } else {
          console.warn("⚠️ Unexpected auth result:", result.params);
          onError?.("Unexpected authentication response");
        }
      } else if (result.type === "cancel") {
        console.log("❌ User cancelled Google OAuth");
        onError?.("Authentication cancelled");
      } else if (result.type === "dismiss" || result.type === "locked") {
        console.log("❌ Auth session dismissed or locked");
        onError?.("Authentication session closed");
      } else {
        console.log("❌ Unknown result type:", result.type);
        onError?.("Authentication failed");
      }
    } catch (error: any) {
      console.error("❌ Google OAuth error:", error);
      Alert.alert(
        "Authentication Error",
        error?.message || "An error occurred during authentication. Please try again."
      );
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
