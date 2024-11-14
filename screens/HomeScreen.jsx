import * as React from "react";
import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [goal, setGoal] = useState(""); // 入力中の目標
  const [savedGoal, setSavedGoal] = useState(""); // 保存された目標
  const [startDate, setStartDate] = useState(null); // 開始日
  const [savedStartDate, setSavedStartDate] = useState(null); // 保存された開始日
  const [showDatePicker, setShowDatePicker] = useState(false); // DatePickerの表示
  const [currentDay, setCurrentDay] = useState(0); // 現在の日数
  const [endDate, setEndDate] = useState(null); // 84日目の日付

  // Firestoreから目標と開始日を取得
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "Goal", "goal");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedGoal(data.goal);
        if (data.startDate) {
          const start = data.startDate.toDate();
          setSavedStartDate(start);
          setStartDate(start);
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, []);

  // Firestoreに開始日を保存する関数
  const saveStartDate = async (selectedDate) => {
    if (selectedDate) {
      const docRef = doc(db, "Goal", "goal");
      await setDoc(docRef, { startDate: Timestamp.fromDate(selectedDate) }, { merge: true });
      setSavedStartDate(selectedDate);
      console.log("開始日が保存されました");
    } else {
      console.log("開始日が選択されていません");
    }
  };

  // Firestoreに目標を保存する関数
  const saveGoal = async () => {
    if (goal.trim()) {
      const docRef = doc(db, "Goal", "goal");
      await setDoc(docRef, { goal }, { merge: true });
      setSavedGoal(goal);
      setGoal("");
      console.log("目標が保存されました");
    } else {
      console.log("目標が入力されていません");
    }
  };

  // 開始日が設定されたときに日数を計算
  useEffect(() => {
    if (savedStartDate) {
      const today = new Date();
      const diffInTime = today.getTime() - savedStartDate.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24)) + 1; // 1日目から開始
      setCurrentDay(diffInDays <= 84 ? diffInDays : 84); // 最大84日目まで表示

      // 84日後の日付を計算して設定
      const calculatedEndDate = new Date(savedStartDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + 83); // 開始日から83日後が84日目
      setEndDate(calculatedEndDate);
    }
  }, [savedStartDate]);

  // 各月のボタン色を切り替えるスタイル関数
  const getButtonStyle = (month) => {
    if (month === 1 && currentDay >= 1 && currentDay <= 28) {
      return styles.firstMonthButton;
    } else if (month === 2 && currentDay >= 29 && currentDay <= 56) {
      return styles.secondMonthButton;
    } else if (month === 3 && currentDay >= 57 && currentDay <= 84) {
      return styles.thirdMonthButton;
    }
    return styles.defaultButton;
  };

  return (
    <View style={styles.container}>
      {/* 開始日を選択するボタン */}
      <Button title="開始日を選択" onPress={() => setShowDatePicker(true)} />

      {/* DatePickerを表示 */}
      {showDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
              saveStartDate(selectedDate); // 日付選択時に自動保存
            }
          }}
        />
      )}

      {/* 現在の経過日数を表示 */}
      <Text style={styles.goalText}>
        {savedStartDate
          ? `開始日から${currentDay}日目です`
          : "開始日を設定してください"}
      </Text>

      {/* 開始日と終了日の範囲表示 */}
      {savedStartDate && endDate && (
        <Text style={styles.goalText}>
          {savedStartDate.toLocaleDateString()} 〜 {endDate.toLocaleDateString()}
        </Text>
      )}

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
        color={getButtonStyle(1).backgroundColor}
      />
      <Button
        title="2ヶ月目標へ"
        onPress={() => navigation.navigate("2ヶ月目標")}
        color={getButtonStyle(2).backgroundColor}
      />
      <Button
        title="3ヶ月目標へ"
        onPress={() => navigation.navigate("3ヶ月目標")}
        color={getButtonStyle(3).backgroundColor}
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
  defaultButton: {
    backgroundColor: "#9f9f9f", // デフォルトのボタン色
  },
  firstMonthButton: {
    backgroundColor: "#007AFF", // 1ヶ月目のボタン色
  },
  secondMonthButton: {
    backgroundColor: "#007AFF", // 2ヶ月目のボタン色
  },
  thirdMonthButton: {
    backgroundColor: "#007AFF", // 3ヶ月目のボタン色
  },
});
