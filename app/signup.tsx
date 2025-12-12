import BackgroundGradient from "@/components/BackgroundGradient";
import CustomTextInput from "@/components/CustomTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { useAuth } from "@/lib/auth-context";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SignUpScreen = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [emailValid, setEmailValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Enhanced password validation
  const validatePassword = (pwd: string) => {
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numberOrSpecial: /[0-9!@#$%^&*(),.?":{}|<>]/.test(pwd),
      isValid:
        pwd.length >= 8 &&
        /[A-Z]/.test(pwd) &&
        /[a-z]/.test(pwd) &&
        /[0-9!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword.length > 0;

  const handleNameChange = (text: string) => {
    setName(text);
    setNameValid(text.length >= 2); // Changed to 2 to match backend
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailValid(validateEmail(text));
  };

  const handleSignUp = async () => {
    // Validate name (at least 2 characters for backend)
    if (name.length < 2) {
      Toast.show({
        type: "error",
        text1: "Invalid Name",
        text2: "Name must be at least 2 characters.",
      });
      return;
    }

    if (!emailValid) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
      });
      return;
    }

    // Enhanced password validation
    if (!passwordValidation.isValid) {
      let errorMsg = "Password must have:\n";
      if (!passwordValidation.length) errorMsg += "• At least 8 characters\n";
      if (!passwordValidation.uppercase)
        errorMsg += "• At least 1 uppercase letter\n";
      if (!passwordValidation.lowercase)
        errorMsg += "• At least 1 lowercase letter\n";
      if (!passwordValidation.numberOrSpecial)
        errorMsg += "• At least 1 number or special character";

      Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: errorMsg.trim(),
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Passwords do not match.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("📝 SignUp Screen - Starting signup process");
      console.log("  Name:", name);
      console.log("  Email:", email);
      console.log("  Password length:", password.length);

      const response = await signUp({
        name,
        email,
        password,
        confirmPassword,
      });

      console.log("✅ SignUp Screen - Signup successful");
      console.log("✅ User authenticated with name:", response.user.name);

      // Show success and navigate to account created screen
      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: `Welcome ${response.user.name}!`,
      });

      // Navigate to account created screen after a short delay
      setTimeout(() => {
        router.replace("/account-created");
      }, 500);
    } catch (error: any) {
      console.error("❌ SignUp Screen - Error occurred:");
      console.error("  Error type:", error.constructor.name);
      console.error("  Error message:", error.message);
      console.error("  Error response:", error.response);
      console.error("  Full error:", error);

      // Enhanced error handling to show backend validation errors
      const errorMessage = error?.response?.data?.message;
      let displayMessage = "Failed to create account. Please try again.";

      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join("\n");
      } else if (typeof errorMessage === "string") {
        displayMessage = errorMessage;
      }

      Toast.show({
        type: "error",
        text1: "Sign Up Failed",
        text2: displayMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (token: string) => {
    try {
      console.log("✅ Google OAuth successful, signing in with token");
      await signInWithGoogle(token);

      Toast.show({
        type: "success",
        text1: "Welcome!",
        text2: "Successfully signed in with Google",
      });

      // Navigate to home (membership page) after successful login
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 500);
    } catch (error: any) {
      console.error("❌ Error signing in with Google:", error);
      Toast.show({
        type: "error",
        text1: "Sign In Failed",
        text2: error?.message || "Failed to sign in with Google",
      });
    }
  };

  const handleGoogleError = (error: string) => {
    console.error("❌ Google OAuth error:", error);
    Toast.show({
      type: "error",
      text1: "Google Sign In Failed",
      text2: error,
    });
  };

  const handleSignIn = () => {
    router.replace("/login");
  };

  const isFormValid =
    name.length >= 2 &&
    emailValid &&
    passwordValidation.isValid &&
    passwordsMatch;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Sign Up</Text>
              </View>
              <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Title */}
              <Text style={styles.title}>Sign Up</Text>

              {/* Name Input */}
              <CustomTextInput
                label="Name"
                value={name}
                onChangeText={handleNameChange}
                placeholder="Full Name"
                autoCapitalize="words"
                showCheck={nameValid}
              />

              {/* Email Input */}
              <CustomTextInput
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="user@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                showCheck={emailValid}
              />

              {/* Password Input */}
              <CustomTextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                showPasswordToggle
                onPasswordToggle={() => setShowPassword(!showPassword)}
              />

              {/* Password Requirements */}
              {password.length > 0 && (
                <View style={styles.passwordRequirements}>
                  <Text style={styles.requirementsTitle}>
                    Password must have:
                  </Text>
                  <View style={styles.requirementRow}>
                    <Text
                      style={
                        passwordValidation.length
                          ? styles.requirementMet
                          : styles.requirementUnmet
                      }
                    >
                      {passwordValidation.length ? "✓" : "○"} At least 8
                      characters
                    </Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Text
                      style={
                        passwordValidation.uppercase
                          ? styles.requirementMet
                          : styles.requirementUnmet
                      }
                    >
                      {passwordValidation.uppercase ? "✓" : "○"} At least 1
                      uppercase letter (A-Z)
                    </Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Text
                      style={
                        passwordValidation.lowercase
                          ? styles.requirementMet
                          : styles.requirementUnmet
                      }
                    >
                      {passwordValidation.lowercase ? "✓" : "○"} At least 1
                      lowercase letter (a-z)
                    </Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Text
                      style={
                        passwordValidation.numberOrSpecial
                          ? styles.requirementMet
                          : styles.requirementUnmet
                      }
                    >
                      {passwordValidation.numberOrSpecial ? "✓" : "○"} At least
                      1 number or special character
                    </Text>
                  </View>
                </View>
              )}

              {/* Confirm Password Input */}
              <CustomTextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle
                onPasswordToggle={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              {/* Sign Up Button */}
              <PrimaryButton
                title="Sign Up"
                onPress={handleSignUp}
                loading={isLoading}
                disabled={!isFormValid}
              />

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleSignIn}>
                  <Text style={styles.signInLink}>Sign in.</Text>
                </TouchableOpacity>
              </View>

              {/* Google Sign In Button */}
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#333333",
    fontWeight: "bold",
    marginTop: -20,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: -50,
    marginTop: -50,
  },
  logo: {
    width: 260,
    height: 260,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#333333",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  signInText: {
    fontSize: 14,
    color: "#333333",
  },
  signInLink: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
  },
  passwordRequirements: {
    marginTop: -8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 6,
  },
  requirementRow: {
    marginBottom: 4,
  },
  requirementMet: {
    fontSize: 12,
    color: "#22c55e",
    fontWeight: "500",
  },
  requirementUnmet: {
    fontSize: 12,
    color: "#999999",
    fontWeight: "400",
  },
});

export default SignUpScreen;
