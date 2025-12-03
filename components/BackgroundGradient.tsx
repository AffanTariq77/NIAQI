import { BlurMask, Canvas, Circle } from "@shopify/react-native-skia";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const BackgroundGradient = () => {
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#FFFFFF", "#EAE3FF", "#DCEBFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Decorative blurred circles */}
        <View style={{ filter: "blur(80px)", WebkitFilter: "blur(80px)" } as any}>
          <View style={[styles.circle, styles.blueCircle]} />
        </View>
        <View style={{ filter: "blur(100px)", WebkitFilter: "blur(100px)" } as any}>
          <View style={[styles.circle, styles.cyanCircle]} />
        </View>
        <View style={{ filter: "blur(100px)", WebkitFilter: "blur(100px)" } as any}>
          <View style={[styles.circle, styles.pinkCircle]} />
        </View>
        <View style={{ filter: "blur(100px)", WebkitFilter: "blur(100px)" } as any}>
          <View style={[styles.circle, styles.purpleCircle]} />
        </View>
        <View style={{ filter: "blur(100px)", WebkitFilter: "blur(100px)" } as any}>
          <View style={[styles.circle, styles.pinkCircle2]} />
        </View>
        <View style={{ filter: "blur(100px)", WebkitFilter: "blur(100px)" } as any}>
          <View style={[styles.circle, styles.lightBlueCircle]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Blue Oval */}
        <Circle cx={52 + 473 / 2} cy={486 + 377 / 2} r={200} color="rgba(155,193,251,0.65)">
          <BlurMask blur={100} style="normal" />
        </Circle>

        {/* Cyan Oval */}
        <Circle cx={-164 + 237 / 2} cy={276 + 372 / 2} r={150} color="rgba(146,242,255,0.55)">
          <BlurMask blur={120} style="normal" />
        </Circle>

        {/* Pink Oval */}
        <Circle cx={-28 + 215 / 2} cy={689 + 252 / 2} r={130} color="rgba(255,135,207,0.55)">
          <BlurMask blur={120} style="normal" />
        </Circle>

        {/* Purple Oval */}
        <Circle cx={104 + 197 / 2} cy={506 + 497 / 2} r={150} color="rgba(156,160,251,0.55)">
          <BlurMask blur={120} style="normal" />
        </Circle>

        {/* Pink Oval 2 */}
        <Circle cx={-53 + 172 / 2} cy={393 + 265 / 2} r={120} color="rgba(255,135,207,0.5)">
          <BlurMask blur={120} style="normal" />
        </Circle>

        {/* Light Blue Oval */}
        <Circle cx={169 + 135 / 2} cy={291 + 347 / 2} r={100} color="rgba(189,235,255,0.55)">
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
    backgroundColor: "rgba(155,193,251,0.65)",
    top: 400,
    left: 100,
  },
  cyanCircle: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(146,242,255,0.55)",
    top: 100,
    right: -100,
  },
  pinkCircle: {
    width: 280,
    height: 280,
    backgroundColor: "rgba(255,135,207,0.55)",
    bottom: 150,
    left: -50,
  },
  purpleCircle: {
    width: 350,
    height: 350,
    backgroundColor: "rgba(156,160,251,0.55)",
    top: 500,
    left: 150,
  },
  pinkCircle2: {
    width: 250,
    height: 250,
    backgroundColor: "rgba(255,135,207,0.5)",
    top: 300,
    left: -30,
  },
  lightBlueCircle: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(189,235,255,0.55)",
    top: 200,
    right: 100,
  },
});
