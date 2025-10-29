import { BlurMask, Canvas, Circle } from "@shopify/react-native-skia";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const BackgroundGradient = () => {
  // Use simple gradient for web since Skia requires CanvasKit setup
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#FFFFFF", "#F8F5FF", "#E8F0FE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Decorative circles for web with blur effect */}
        <View style={{ filter: "blur(100px)", WebkitFilter: "blur(100px)" } as any}>
          <View style={[styles.circle, styles.blueCircle]} />
        </View>
        <View style={{ filter: "blur(150px)", WebkitFilter: "blur(150px)" } as any}>
          <View style={[styles.circle, styles.cyanCircle]} />
        </View>
        <View style={{ filter: "blur(150px)", WebkitFilter: "blur(150px)" } as any}>
          <View style={[styles.circle, styles.pinkCircle]} />
        </View>
        <View style={{ filter: "blur(150px)", WebkitFilter: "blur(150px)" } as any}>
          <View style={[styles.circle, styles.purpleCircle]} />
        </View>
        <View style={{ filter: "blur(150px)", WebkitFilter: "blur(150px)" } as any}>
          <View style={[styles.circle, styles.pinkCircle2]} />
        </View>
        <View style={{ filter: "blur(100px)", WebkitFilter: "blur(100px)" } as any}>
          <View style={[styles.circle, styles.lightBlueCircle]} />
        </View>
      </View>
    );
  }

  // Use Skia Canvas for native platforms
  return (
    <View style={styles.container}>
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Blue Oval */}
        <Circle cx={52 + 473 / 2} cy={486 + 377 / 2} r={200} color="#9BC1FB">
          <BlurMask blur={150} style="normal" />
        </Circle>

        {/* Cyan Oval */}
        <Circle cx={-164 + 237 / 2} cy={276 + 372 / 2} r={150} color="#92F2FF">
          <BlurMask blur={200} style="normal" />
        </Circle>

        {/* Pink Oval */}
        <Circle cx={-28 + 215 / 2} cy={689 + 252 / 2} r={130} color="#FF87CF">
          <BlurMask blur={200} style="normal" />
        </Circle>

        {/* Purple Oval */}
        <Circle cx={104 + 197 / 2} cy={506 + 497 / 2} r={150} color="#9CA0FB">
          <BlurMask blur={200} style="normal" />
        </Circle>

        {/* Pink Oval 2 */}
        <Circle cx={-53 + 172 / 2} cy={393 + 265 / 2} r={120} color="#FF87CF">
          <BlurMask blur={200} style="normal" />
        </Circle>

        {/* Light Blue Oval */}
        <Circle cx={169 + 135 / 2} cy={291 + 347 / 2} r={100} color="#BDEBFF">
          <BlurMask blur={100} style="normal" />
        </Circle>
      </Canvas>
    </View>
  );
};

export default BackgroundGradient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
  },
  blueCircle: {
    width: 400,
    height: 400,
    backgroundColor: "#9BC1FB",
    opacity: 0.3,
    top: 400,
    left: 100,
  },
  cyanCircle: {
    width: 300,
    height: 300,
    backgroundColor: "#92F2FF",
    opacity: 0.3,
    top: 100,
    right: -100,
  },
  pinkCircle: {
    width: 280,
    height: 280,
    backgroundColor: "#FF87CF",
    opacity: 0.25,
    bottom: 150,
    left: -50,
  },
  purpleCircle: {
    width: 350,
    height: 350,
    backgroundColor: "#9CA0FB",
    opacity: 0.25,
    top: 500,
    left: 150,
  },
  pinkCircle2: {
    width: 250,
    height: 250,
    backgroundColor: "#FF87CF",
    opacity: 0.25,
    top: 300,
    left: -30,
  },
  lightBlueCircle: {
    width: 200,
    height: 200,
    backgroundColor: "#BDEBFF",
    opacity: 0.3,
    top: 200,
    right: 100,
  },
});
