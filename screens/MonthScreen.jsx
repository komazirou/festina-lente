import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Firebaseの設定ファイルをインポート

export default function MonthScreen({ route }) {
  const { period } = route.params;
  const navigation = useNavigation();
  const [goal, setGoal] = useState(""); // 入力中の目標
  const [savedGoal, setSavedGoal] = useState(""); // 保存された目標

  // 週のリストを生成 (1-4、5-8、9-12)
  const weekRanges = {
    "1ヶ月目": [1, 4],
    "2ヶ月目": [5, 8],
    "3ヶ月目": [9, 12],
  };

  const [startWeek, endWeek] = weekRanges[period];
  const weeksToShow = Array.from(
    { length: endWeek - startWeek + 1 },
    (_, i) => ({
      week: startWeek + i,
    })
  );

  // Firestoreから目標を取得
  useEffect(() => {
    const fetchGoal = async () => {
      const docRef = doc(db, "monthlyGoals", `month-${period}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSavedGoal(docSnap.data().goal);
      } else {
        console.log("No such document!");
      }
    };

    fetchGoal();
  }, [period]);

  // Firestoreに目標を保存する関数
  const saveGoal = async () => {
    if (goal.trim()) {
      const docRef = doc(db, "monthlyGoals", `month-${period}`); // 週番号をドキュメントIDとして使用
      await setDoc(docRef, { goal });
      setSavedGoal(goal);
      setGoal("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{period}の目標</Text>

      {/* 保存された目標を表示 */}
      <Text style={styles.goalText}>
        {savedGoal ? `目標: ${savedGoal}` : "目標を入力してください"}
      </Text>

      {/* 目標を入力するフィールド */}
      <TextInput
        style={styles.input}
        placeholder="今月の目標を入力"
        value={goal}
        onChangeText={setGoal}
      />

      {/* 目標を保存するボタン */}
      <Button title="目標を保存" onPress={saveGoal} />

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
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    width: 250,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  goalText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
  },
});
