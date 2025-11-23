import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to NIAQI</Text>
      <Text style={styles.subtitle}>Your Learning Platform</Text>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Get Started"
          onPress={() => router.push("/onboarding")}
        />
        <PrimaryButton title="Sign In" onPress={() => router.push("/login")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
});
