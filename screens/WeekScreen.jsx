import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Firebaseの設定ファイルをインポート

export default function WeekScreen({ route }) {
  const { period } = route.params; // 週の番号
  const [goal, setGoal] = useState(""); // 入力中の目標
  const [savedGoal, setSavedGoal] = useState(""); // 保存された目標
  const navigation = useNavigation();

  // Firestoreから目標を取得
  useEffect(() => {
    const fetchGoal = async () => {
      const docRef = doc(db, "weeklyGoals", `week-${period}`);
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
      const docRef = doc(db, "weeklyGoals", `week-${period}`); // 週番号をドキュメントIDとして使用
      await setDoc(docRef, { goal });
      setSavedGoal(goal);
      setGoal("");
    }
  };

  // 該当週の日付範囲を計算
  const startDay = (period - 1) * 7 + 1;
  const endDay = startDay + 6;
  const daysToShow = Array.from({ length: 7 }, (_, i) => startDay + i);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{period}週間目の目標</Text>

      {/* 保存された目標を表示 */}
      <Text style={styles.goalText}>
        {savedGoal ? `目標: ${savedGoal}` : "目標を入力してください"}
      </Text>

      {/* 目標を入力するフィールド */}
      <TextInput
        style={styles.input}
        placeholder="この週の目標を入力"
        value={goal}
        onChangeText={setGoal}
      />

      {/* 目標を保存するボタン */}
      <Button title="目標を保存" onPress={saveGoal} />

      <Text style={styles.subtitle}>日別目標</Text>
      {daysToShow.map((day) => (
        <Button
          key={day}
          title={`${day}日目`}
          onPress={() => navigation.navigate(`${day}日目`)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
