import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundGradient from '../components/BackgroundGradient';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: any;
  buttonText: string;
  imageStyle?: any;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Unparalleled Experience',
    description:
      'Our team consists of highly experienced industry professionals with over 50 years combined experience in the field and 20 years in the classroom.',
    image: require('../assets/logo.png'),
    buttonText: 'Next',
    imageStyle: {
      width: 420,
      height: 420,
    },
  },
  {
    id: 2,
    title: 'Comprehensive Mold Courses',
    description:
      'We provide the courses and tools you will need to properly identify, document and remediate IAQ related problems in living and working environments.',
    image: require('../assets/mould.png'),
    buttonText: 'Next',
    imageStyle: {
      marginTop: 70,
      width: 220,
      height: 220,
    },
  },
  {
    id: 3,
    title: 'State Approved Certifications',
    description:
      'We are currently approved in the state of Florida and will be expanding nation wide. Our courses can result in the following certifications.',
    image: require('../assets/Medallions.png'),
    buttonText: 'Get Started',
    imageStyle: {
      width: 300,
      height: 300,
    },
  },
];


const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const currentSlide = onboardingData[currentPage];

  // Animation values for content transition
  const contentOpacity = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);

  // Animation values for pagination dashes
  const dot1Opacity = useSharedValue(1);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);
  
  const dot1Width = useSharedValue(32);
  const dot2Width = useSharedValue(24);
  const dot3Width = useSharedValue(24);

  const goToNextPage = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      
      // Animate content transition - fade out current content
      contentOpacity.value = withTiming(0, { duration: 150 });
      contentTranslateX.value = withTiming(-50, { duration: 150 });
      
      // Update state after a short delay
      setTimeout(() => {
        setCurrentPage(nextPage);
        // Set new content off-screen to the right, then slide in from right
        contentTranslateX.value = 100;
        contentOpacity.value = 0;
        // Animate slide in from right
        setTimeout(() => {
          contentOpacity.value = withTiming(1, { duration: 200 });
          contentTranslateX.value = withTiming(0, { duration: 200 });
        }, 50);
      }, 150);

      // Animate pagination dots
      animatePaginationDots(nextPage);
    } else {
      // Navigate to login screen
      router.push('/login');
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      
      // Animate content transition - fade out current content
      contentOpacity.value = withTiming(0, { duration: 150 });
      contentTranslateX.value = withTiming(50, { duration: 150 });
      
      // Update state after a short delay
      setTimeout(() => {
        setCurrentPage(prevPage);
        // Set new content off-screen to the left, then slide in from left
        contentTranslateX.value = -100;
        contentOpacity.value = 0;
        // Animate slide in from left
        setTimeout(() => {
          contentOpacity.value = withTiming(1, { duration: 200 });
          contentTranslateX.value = withTiming(0, { duration: 200 });
        }, 50);
      }, 150);

      // Animate pagination dots
      animatePaginationDots(prevPage);
    }
  };

  const handleNext = () => {
    goToNextPage();
  };

  const handleSkip = () => {
    router.push('/login');
  };

  const animatePaginationDots = (newPage: number) => {
    // Reset all dashes
    dot1Opacity.value = withTiming(0.3, { duration: 200 });
    dot2Opacity.value = withTiming(0.3, { duration: 200 });
    dot3Opacity.value = withTiming(0.3, { duration: 200 });
    
    dot1Width.value = withTiming(24, { duration: 200 });
    dot2Width.value = withTiming(24, { duration: 200 });
    dot3Width.value = withTiming(24, { duration: 200 });

    // Animate active dash
    setTimeout(() => {
      if (newPage === 0) {
        dot1Opacity.value = withTiming(1, { duration: 200 });
        dot1Width.value = withTiming(32, { duration: 200 });
      } else if (newPage === 1) {
        dot2Opacity.value = withTiming(1, { duration: 200 });
        dot2Width.value = withTiming(32, { duration: 200 });
      } else if (newPage === 2) {
        dot3Opacity.value = withTiming(1, { duration: 200 });
        dot3Width.value = withTiming(32, { duration: 200 });
      }
    }, 100);
  };

  // Swipe gesture handler
  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      const { translationX, velocityX } = event;
      
      // Determine swipe direction and threshold
      const swipeThreshold = 50;
      const velocityThreshold = 500;
      
      if (translationX > swipeThreshold || velocityX > velocityThreshold) {
        // Swipe right - go to previous page
        runOnJS(goToPreviousPage)();
      } else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
        // Swipe left - go to next page
        runOnJS(goToNextPage)();
      }
    });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [
        { translateX: contentTranslateX.value }
      ],
    };
  });

  const dot1AnimatedStyle = useAnimatedStyle(() => {
    return {
      width: dot1Width.value,
      opacity: dot1Opacity.value,
    };
  });

  const dot2AnimatedStyle = useAnimatedStyle(() => {
    return {
      width: dot2Width.value,
      opacity: dot2Opacity.value,
    };
  });

  const dot3AnimatedStyle = useAnimatedStyle(() => {
    return {
      width: dot3Width.value,
      opacity: dot3Opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.backgroundContainer}>
        <BackgroundGradient />
      </View>
        <SafeAreaView style={styles.container}>
          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Content Area */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.contentArea}>
              <Animated.View style={[styles.content, contentAnimatedStyle]}>
                {/* Logo/Image */}
                <View style={styles.imageContainer}>
  <Image
    source={currentSlide.image}
    style={[styles.defaultImage, currentSlide.imageStyle]}
    resizeMode="contain"
  />
</View>
                {/* Title */}
                <Text style={styles.title}>{currentSlide.title}</Text>

                {/* Description */}
                <Text style={styles.description}>{currentSlide.description}</Text>
              </Animated.View>
            </View>
          </GestureDetector>

          {/* Fixed Bottom Area */}
          <View style={styles.bottomArea}>
            {/* Pagination Indicators - as horizontal dashes */}
            <View style={styles.pagination}>
              <Animated.View style={[styles.paginationDash, dot1AnimatedStyle]} />
              <Animated.View style={[styles.paginationDash, dot2AnimatedStyle]} />
              <Animated.View style={[styles.paginationDash, dot3AnimatedStyle]} />
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>{currentSlide.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradient: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300, // keeps a consistent frame height for all slides
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    marginTop: -300,
  },
  defaultImage: {
    alignSelf: 'center',
  },
  
  
  image: {
    width: 240,
    height: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 50,
    paddingHorizontal: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 3,
  },
  paginationDash: {
    height: 3,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  nextButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default OnboardingScreen;
