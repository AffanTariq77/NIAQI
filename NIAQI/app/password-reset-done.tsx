import BackgroundGradient from '@/components/BackgroundGradient';
import PrimaryButton from '@/components/PrimaryButton';
import { router } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PasswordResetDoneScreen = () => {
  const handleDone = () => {
    // Navigate to login screen
    router.replace('/login');
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Logo */}
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Success Message */}
          <Text style={styles.successMessage}>
            Your Password Has Been Reset!
          </Text>

          {/* Done Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Done"
              onPress={handleDone}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  container: {
    flex: 1,
    zIndex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  successMessage: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default PasswordResetDoneScreen;

