import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface ScreenData {
  id: number;
  title: string;
  description: string;
  icon?: string;
  illustration?: React.ReactNode;
}

const screens: ScreenData[] = [
  {
    id: 1,
    title: 'Unparalleled Experience',
    description: 'Our team consists of highly experienced industry professionals with over 50 years combined experience in the field and 20 years in the classroom.',
  },
  {
    id: 2,
    title: 'Comprehensive Mold Courses',
    description: 'We provide the courses and tools you will need to properly identify, document and remediate IAQ related problems in living and working environments.',
  },
  {
    id: 3,
    title: 'State Approved Certifications',
    description: 'We are currently approved in the state of Florida and will be expanding nation wide. Our courses can result in the following certifications.',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const renderVirusIllustration = () => (
    <View style={styles.illustrationContainer}>
      <View style={styles.virusContainer}>
        {/* Main virus particle */}
        <View style={[styles.virusMain, { backgroundColor: '#8B5CF6' }]}>
          <View style={styles.virusSpike} />
          <View style={[styles.virusSpike, { transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.virusSpike, { transform: [{ rotate: '90deg' }] }]} />
          <View style={[styles.virusSpike, { transform: [{ rotate: '135deg' }] }]} />
        </View>
        
        {/* Smaller particles */}
        <View style={[styles.virusSmall, { backgroundColor: '#A78BFA', top: 50, left: 20 }]} />
        <View style={[styles.virusSmall, { backgroundColor: '#C4B5FD', top: 80, right: 30 }]} />
        <View style={[styles.virusSmall, { backgroundColor: '#DDD6FE', top: 30, right: 10 }]} />
      </View>
    </View>
  );

  const renderCertificationBadge = () => (
    <View style={styles.illustrationContainer}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <View style={styles.badgeInner}>
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
        </View>
      </View>
    </View>
  );

  const renderIllustration = (screenId: number) => {
    switch (screenId) {
      case 1:
        return (
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        );
      case 2:
        return renderVirusIllustration();
      case 3:
        return renderCertificationBadge();
      default:
        return null;
    }
  };

  const renderScreen = (screen: ScreenData, index: number) => (
    <Animated.View 
      key={screen.id} 
      style={[
        styles.screen,
        { opacity: fadeAnim }
      ]}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8F7FF']}
        style={styles.gradient}
      >
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.time}>9:41</Text>
          <View style={styles.statusIcons}>
            <Ionicons name="cellular" size={16} color="#000" />
            <Ionicons name="wifi" size={16} color="#000" style={styles.statusIcon} />
            <Ionicons name="battery-full" size={16} color="#000" style={styles.statusIcon} />
          </View>
          {index < screens.length - 1 && (
            <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {renderIllustration(screen.id)}
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{screen.title}</Text>
            <Text style={styles.description}>{screen.description}</Text>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          <View style={styles.progressContainer}>
            {screens.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i === index && styles.progressDotActive
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity style={styles.nextButton} onPress={nextScreen}>
            <Text style={styles.nextButtonText}>
              {index === screens.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderScreen(screens[currentScreen], currentScreen)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 4,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 120,
  },
  illustrationContainer: {
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  virusContainer: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  virusMain: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    top: 60,
    left: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  virusSpike: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: '#6D28D9',
    borderRadius: 2,
  },
  virusSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A78BFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  navigation: {
    paddingHorizontal: 40,
    paddingBottom: 50,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#1F2937',
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
