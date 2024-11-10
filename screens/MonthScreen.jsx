import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MonthScreen({ route }) {
  const { period } = route.params;
  const navigation = useNavigation();

  // 週のリストを生成 (1-4、5-8、9-12)
  const weekRanges = {
    "4month": [1, 4],
    "8month": [5, 8],
    "12month": [9, 12],
  };

  const [startWeek, endWeek] = weekRanges[period];
  const weeksToShow = Array.from({ length: endWeek - startWeek + 1 }, (_, i) => ({
    week: startWeek + i,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{period}の目標</Text>
      {weeksToShow.map((item) => (
        <Button
          key={item.week}
          title={`${item.week}週間目標`}
          onPress={() => navigation.navigate(`${item.week}週間目標`)}
        />
      ))}
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
