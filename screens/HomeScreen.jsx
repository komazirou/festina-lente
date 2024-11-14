import * as React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-gesture-handler";
import { useDate } from "../DateProvider";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    startDate,
    currentDay,
    endDate,
    goal,
    savedGoal,
    saveStartDate,
    saveGoal,
    setInputGoal,
    inputGoal,
  } = useDate();

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
      <MaterialIcons
        name="date-range"
        size={24}
        color="#007AFF"
        onPress={() => setShowDatePicker(true)}
      />

      {/* DatePickerを表示 */}
      {showDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              saveStartDate(selectedDate);
            }
          }}
        />
      )}

      {/* 現在の経過日数を表示 */}
      <Text style={styles.goalText}>
        {startDate
          ? `開始日から${currentDay}日目です`
          : "開始日を設定してください"}
      </Text>

      {/* 開始日と終了日の範囲表示 */}
      {startDate && endDate && (
        <Text style={styles.goalText}>
          {startDate.toLocaleDateString()} 〜 {endDate.toLocaleDateString()}
        </Text>
      )}

      <Text style={styles.title}>3ヶ月目標</Text>

      {/* 保存された目標を表示 */}
      <View style={styles.goalContainer}>
        <MaterialIcons name="flag" size={24} color="#FFD700" />
        <Text style={styles.goalText}>
          {savedGoal ? `: ${savedGoal}` : "目標を入力してください"}
        </Text>
      </View>

      {/* 目標を入力するフィールド */}
      <TextInput
        style={styles.input}
        placeholder="この週の目標を入力"
        value={inputGoal}
        onChangeText={setInputGoal}
      />

      {/* 目標を保存するボタン */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveGoal(inputGoal)}
      >
        <Text style={styles.buttonText}>目標を保存</Text>
      </TouchableOpacity>

      {/* 各月目標へのナビゲーションボタン */}
      <TouchableOpacity
        style={getButtonStyle(1)}
        onPress={() => navigation.navigate("1ヶ月目標")}
      >
        <Text style={styles.buttonText}>1ヶ月目標へ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={getButtonStyle(2)}
        onPress={() => navigation.navigate("2ヶ月目標")}
      >
        <Text style={styles.buttonText}>2ヶ月目標へ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={getButtonStyle(3)}
        onPress={() => navigation.navigate("3ヶ月目標")}
      >
        <Text style={styles.buttonText}>3ヶ月目標へ</Text>
      </TouchableOpacity>
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
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  goalText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 8, // アイコンとテキストの間にスペース
  },
  saveButton: {
    backgroundColor: "#3ca03c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "#9f9f9f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  firstMonthButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  secondMonthButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  thirdMonthButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
});
