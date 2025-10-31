import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // perfect two-column fit with margins
const CARD_HEIGHT = 210; // unify all card heights

const features = [
  {
    id: '1',
    title: 'Student Base Data',
    unlocked: true,
    background: require('../assets/DDACE5.png'),
    bgColor: '#DDACE5',
    height: CARD_HEIGHT,
    imageStyle: {
      width: 390,
      height: 300,
      position: 'absolute' as const,
      left: -110,
      bottom: -75,
      opacity: 0.9,
      transform: [{ rotate: '135deg' }],
    },
  },
  {
    id: '2',
    title: 'Forum & Student Page',
    unlocked: true,
    background: require('../assets/9DAFFB.png'),
    bgColor: '#9DAFFB',
    height: CARD_HEIGHT,
    imageStyle: {
      width: 200,
      height: 200,
      alignSelf: 'center' as const,
      marginTop: 30,
      opacity: 0.85,
      bottom: -70,
      right: 10,
      transform: [{ rotate: '60deg' }],
    },
  },
  {
    id: '3',
    title: 'Course Reminder & Discount',
    unlocked: true,
    bgColor: '#54DAE2',
    height: CARD_HEIGHT,
    images: [
      {
        source: require('../assets/54DAE2.png'),
        style: {
          width: 110,
          height: 110,
          alignSelf: 'absolute' as const,
          bottom: 60,
          right: -15,
          opacity: 0.9,
          transform: [{ rotate: '-15deg' }],
        },
      },
      {
        source: require('../assets/54DAE2b.png'),
        style: {
          width: 80,
          height: 80,
          alignSelf: 'absolute' as const,
          bottom: 10,
          right: 60,
        
          opacity: 0.85,
        },
      },
    ],
    imageStyle: {
      width: 130,
      height: 130,
      alignSelf: 'flex-start' as const,
      marginLeft: 10,
      marginTop: 40,
      opacity: 0.9,
    },
  },
  {
    id: '4',
    title: 'Sponsor Discounts & Link To Landing Page',
    unlocked: true,
    background: require('../assets/FE9BB31.png'),
    bgColor: '#FE9BB3',
    height: CARD_HEIGHT,
    images: [
      {
        source: require('../assets/FE9BB31.png'),
        style: {
          width: 50,
          height: 50,
          alignSelf: 'flex-start' as const,
          bottom: 120,
          right: 10,
          opacity: 0.9,
        },
      },
      {
        source: require('../assets/FE9BB3.png'),
        style: {
          width: 130,
          height: 130,
          alignSelf: 'flex-end' as const,
         bottom: -30,
         right: -10,
          opacity: 0.9,
        },
      },
    ],
    imageStyle: {
      width: 150,
      height: 150,
      alignSelf: 'flex-end' as const,
      marginRight: -10,
      marginTop: 15,
      opacity: 0.9,
    },
  },
  {
    id: '5',
    title: 'Resource Library',
    unlocked: false,
    background: require('../assets/ABC9FB.png'),
    bgColor: '#ABC9FB',
    height: CARD_HEIGHT,
    imageStyle: {
      width: 350,
      height: 350,
      alignSelf: 'absolute' as const,
      bottom: -130,
      right: -130,
      opacity: 0.85,
    },
  },
  {
    id: '6',
    title: 'Documents & Processes',
    unlocked: false,
    background: require('../assets/BEA1FE.png'),
    bgColor: '#BEA1FE',
    height: CARD_HEIGHT,
    imageStyle: {
      width: 170,
      height: 170,
      alignSelf: 'flex-end' as const,
      right: -60,
      bottom: 5,
      opacity: 0.9,
    },
  },
  {
    id: '7',
    title: 'Report Verbiage & Disclosure',
    unlocked: false,
    background: require('../assets/9DAFFB.png'),
    bgColor: '#9DAFFB',
    height: CARD_HEIGHT,
    imageStyle: {
      width: 200,
      height: 200,
      alignSelf: 'center' as const,
      marginTop: 30,
      opacity: 0.85,
      bottom: -70,
      right: 10,
      transform: [{ rotate: '60deg' }],
    },
  },
  {
    id: '8',
    title: 'Software Suite',
    unlocked: false,
    background: require('../assets/ABC9FB1.png'),
    bgColor: '#ABC9FB',
    height: CARD_HEIGHT,
    imageStyle: {
      width: 350,
      height: 350,
      alignSelf: 'absolute' as const,
      bottom: -130,
      right: -130,
      opacity: 0.85,
    },
  },
];

const MembershipDetailsScreen = () => {
  const handleFeaturePress = (feature: any) => {
    if (!feature.unlocked) return;
    if (feature.id === '1') {
      router.push('/student-base-data');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Basic Membership</Text>
          <View style={styles.headerSpacer} />
        </View>

      {/* Scrollable Grid */}
        <ScrollView 
          style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              onPress={() => handleFeaturePress(feature)}
              activeOpacity={0.9}
              disabled={!feature.unlocked}
              style={[
                styles.cardWrapper,
                { height: feature.height, backgroundColor: feature.bgColor },
              ]}
            >
              <View style={styles.cardContent}>
                {/* Background decorative images with custom styling */}
                {feature.images ? (
                  feature.images.map((img: any, index: number) => (
                    <Image
                      key={index}
                      source={img.source}
                      style={[styles.cardBackgroundImage, img.style]}
                      resizeMode="contain"
                    />
                  ))
                ) : (
                  <Image
                    source={feature.background}
                    style={[styles.cardBackgroundImage, feature.imageStyle]}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.textWrapper}>
                  <Text style={styles.cardText}>{feature.title}</Text>
                </View>
                 {!feature.unlocked && (
                   <Image source={require('../assets/lock.png')} style={styles.lockIcon} />
                 )}
              </View>
            </TouchableOpacity>
          ))}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
     height: CARD_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBackgroundImage: {
    position: 'absolute',
    zIndex: 0,
  },
  textWrapper: {
    paddingHorizontal: 12,
    paddingTop: 12,
    position: 'relative',
    zIndex: 1,
  },
  cardText: {
    color: '#1C1C1E',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
    letterSpacing: -0.2,
    textAlign: 'left',
  },
  lockIcon: { position: 'absolute', bottom: 20, right: 40, width: 52, height: 52, tintColor: 'rgba(29, 28, 28, 0.5)' },
});

export default MembershipDetailsScreen;
