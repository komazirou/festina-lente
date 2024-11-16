import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function TaskInput({ completionRate }) {
  const animatedHeight = useRef(new Animated.Value(0)).current; // アニメーション用の高さ
  // アニメーションの効果
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: completionRate,
      duration: 800, // アニメーションの速度
      useNativeDriver: false,
    }).start();
  }, [completionRate]);
  return (
    <Animated.View
      style={[
        styles.dynamicBackground,
        {
          height: animatedHeight.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
          backgroundColor: "#3ca03c", // 濃い緑色
          opacity: animatedHeight.interpolate({
            inputRange: [0, 100],
            outputRange: [0.1, 0.5], // 透明度の変化でグラデーション風に
          }),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dynamicBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
