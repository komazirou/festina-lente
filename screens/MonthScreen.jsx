import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useDate } from "../DateProvider";
import { MaterialIcons } from "@expo/vector-icons";

export default function MonthScreen({ route }) {
  const { period } = route.params;
  const navigation = useNavigation();
  const [goal, setGoal] = useState("");
  const [savedGoal, setSavedGoal] = useState("");
  const { currentDay } = useDate();

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

  const saveGoal = async () => {
    if (goal.trim()) {
      const docRef = doc(db, "monthlyGoals", `month-${period}`);
      await setDoc(docRef, { goal });
      setSavedGoal(goal);
      setGoal("");
    }
  };

  const getButtonStyle = (week) => {
    const weekStartDay = (week - 1) * 7 + 1;
    const weekEndDay = week * 7;
    return currentDay >= weekStartDay && currentDay <= weekEndDay
      ? styles.activeWeekButton
      : styles.defaultButton;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <MaterialIcons name="terrain" size={70} color="#FFD700" />
      </Text>

      <Text style={styles.goalText}>
        {savedGoal ? `目標: ${savedGoal}` : "目標を入力してください"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="今月の目標を入力"
        value={goal}
        onChangeText={setGoal}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveGoal}>
        <Text style={styles.saveButtonText}>目標を保存</Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        {weeksToShow.map((item) => (
          <TouchableOpacity
            key={item.week}
            style={[styles.buttonContainer, getButtonStyle(item.week)]}
            onPress={() => navigation.navigate(`${item.week}週間目標`)}
          >
            <Text style={styles.buttonText}>{`${item.week}週間目標`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  goalText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
    paddingHorizontal: 10,
    backgroundColor: "#FFF8E1",
    paddingVertical: 8,
    borderRadius: 10,
    width: "100%",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    width: "100%",
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroup: {
    width: "100%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "#9f9f9f",
  },
  activeWeekButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
