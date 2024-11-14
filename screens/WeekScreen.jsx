import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useDate } from "../DateProvider";

export default function WeekScreen({ route }) {
  const { period } = route.params; // 週の番号
  const [goal, setGoal] = useState(""); // 入力中の目標
  const [savedGoal, setSavedGoal] = useState(""); // 保存された目標
  const navigation = useNavigation();
  const { currentDay } = useDate(); // 現在の日数を取得

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

  const saveGoal = async () => {
    if (goal.trim()) {
      const docRef = doc(db, "weeklyGoals", `week-${period}`);
      await setDoc(docRef, { goal });
      setSavedGoal(goal);
      setGoal("");
    }
  };

  const startDay = (period - 1) * 7 + 1;
  const endDay = startDay + 6;
  const daysToShow = Array.from({ length: 7 }, (_, i) => startDay + i);

  const getButtonStyle = (day) => {
    return currentDay === day ? styles.activeDayButton : styles.defaultButton;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{period}週間目の目標</Text>

      <Text style={styles.goalText}>
        {savedGoal ? `目標: ${savedGoal}` : "目標を入力してください"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="今週の目標を入力"
        value={goal}
        onChangeText={setGoal}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
        <Text style={styles.saveButtonText}>目標を保存</Text>
      </TouchableOpacity>

      {daysToShow.map((day) => (
        <TouchableOpacity
          key={day}
          style={[styles.buttonContainer, getButtonStyle(day)]}
          onPress={() => navigation.navigate(`${day}日目`)}
        >
          <Text style={styles.buttonText}>{`${day}日目`}</Text>
        </TouchableOpacity>
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
  saveButton: {
    backgroundColor: "#3ca03c",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: 250,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: 250,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "#9f9f9f",
  },
  activeDayButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
