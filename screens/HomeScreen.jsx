import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3ヶ月目標のホーム画面</Text>

      {/* 各月目標へのナビゲーションボタン */}
      <Button
        title="1ヶ月目標へ"
        onPress={() => navigation.navigate("1ヶ月目標")}
      />
      <Button
        title="2ヶ月目標へ"
        onPress={() => navigation.navigate("2ヶ月目標")}
      />
      <Button
        title="3ヶ月目標へ"
        onPress={() => navigation.navigate("3ヶ月目標")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
