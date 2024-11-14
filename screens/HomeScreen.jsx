import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Firebaseの設定ファイルをインポート
import { TextInput } from "react-native-gesture-handler";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [goal, setGoal] = useState(""); // 入力中の目標
  const [savedGoal, setSavedGoal] = useState(""); // 保存された目標

  // Firestoreから目標を取得
  useEffect(() => {
    const fetchGoal = async () => {
      const docRef = doc(db, "Goal", "goal");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSavedGoal(docSnap.data().goal);
      } else {
        console.log("No such document!");
      }
    };

    fetchGoal();
  }, []);

  // Firestoreに目標を保存する関数
  const saveGoal = async () => {
    if (goal.trim()) {
      const docRef = doc(db, "Goal", "goal"); // 週番号をドキュメントIDとして使用
      await setDoc(docRef, { goal });
      setSavedGoal(goal);
      setGoal("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3ヶ月目標</Text>

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
