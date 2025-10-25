import { LinearGradient } from 'expo-linear-gradient';
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
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: any;
  buttonText: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Unparalleled Experience',
    description: 'Our team consists of highly experienced industry professionals with over 50 years combined experience in the field and 20 years in the classroom.',
    image: require('../assets/logo.png'),
    buttonText: 'Next',
  },
  {
    id: 2,
    title: 'Comprehensive Mold Courses',
    description: 'We provide the courses and tools you will need to properly identify, document and remediate IAQ related problems in living and working environments.',
    image: require('../assets/mould.png'),
    buttonText: 'Next',
  },
  {
    id: 3,
    title: 'State Approved Certifications',
    description: 'We are currently approved in the state of Florida and will be expanding nation wide. Our courses can result in the following certifications.',
    image: require('../assets/Medallions.png'),
    buttonText: 'Get Started',
  },
];

const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const currentSlide = onboardingData[currentPage];

  // Animation values for content transition
  const contentOpacity = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);

  // Animation values for pagination dots
  const dot1Scale = useSharedValue(1);
  const dot1Opacity = useSharedValue(1);
  const dot2Scale = useSharedValue(0.8);
  const dot2Opacity = useSharedValue(0.4);
  const dot3Scale = useSharedValue(0.8);
  const dot3Opacity = useSharedValue(0.4);

  const goToNextPage = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      
      // Animate content transition
      contentOpacity.value = withTiming(0, { duration: 150 });
      contentTranslateX.value = withTiming(-50, { duration: 150 });
      
      // Update state after a short delay
      setTimeout(() => {
        setCurrentPage(nextPage);
        contentOpacity.value = withTiming(1, { duration: 200 });
        contentTranslateX.value = withTiming(0, { duration: 200 });
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
      
      // Animate content transition
      contentOpacity.value = withTiming(0, { duration: 150 });
      contentTranslateX.value = withTiming(50, { duration: 150 });
      
      // Update state after a short delay
      setTimeout(() => {
        setCurrentPage(prevPage);
        contentOpacity.value = withTiming(1, { duration: 200 });
        contentTranslateX.value = withTiming(0, { duration: 200 });
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
    // Reset all dots
    dot1Scale.value = withSpring(0.8, { damping: 15 });
    dot1Opacity.value = withTiming(0.4, { duration: 200 });
    dot2Scale.value = withSpring(0.8, { damping: 15 });
    dot2Opacity.value = withTiming(0.4, { duration: 200 });
    dot3Scale.value = withSpring(0.8, { damping: 15 });
    dot3Opacity.value = withTiming(0.4, { duration: 200 });

    // Animate active dot
    setTimeout(() => {
      if (newPage === 0) {
        dot1Scale.value = withSpring(1.2, { damping: 15 });
        dot1Opacity.value = withTiming(1, { duration: 200 });
      } else if (newPage === 1) {
        dot2Scale.value = withSpring(1.2, { damping: 15 });
        dot2Opacity.value = withTiming(1, { duration: 200 });
      } else if (newPage === 2) {
        dot3Scale.value = withSpring(1.2, { damping: 15 });
        dot3Opacity.value = withTiming(1, { duration: 200 });
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
      transform: [{ scale: dot1Scale.value }],
      opacity: dot1Opacity.value,
    };
  });

  const dot2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: dot2Scale.value }],
      opacity: dot2Opacity.value,
    };
  });

  const dot3AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: dot3Scale.value }],
      opacity: dot3Opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4F8" />
      <LinearGradient
        colors={['#F0F4F8', '#E0D8F0', '#F0E8F8']}
        style={styles.gradient}
      >
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
                  <Image source={currentSlide.image} style={styles.image} resizeMode="contain" />
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
            {/* Pagination Indicators */}
            <View style={styles.pagination}>
              <Animated.View style={[styles.paginationDot, dot1AnimatedStyle]} />
              <Animated.View style={[styles.paginationDot, dot2AnimatedStyle]} />
              <Animated.View style={[styles.paginationDot, dot3AnimatedStyle]} />
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>{currentSlide.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#CCCCCC',
  },
  nextButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginHorizontal: 40,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
