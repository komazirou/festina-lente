import * as React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* 開始日を選択するボタン */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <MaterialIcons name="date-range" size={30} color="#007AFF" />
          <Text style={styles.dateText}>
            {startDate ? `開始日から${currentDay}日目です` : "開始日を設定してください"}
          </Text>
        </TouchableOpacity>

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
      </View>

      {/* 開始日と終了日の範囲表示 */}
      {startDate && endDate && (
        <Text style={styles.dateRangeText}>
          {startDate.toLocaleDateString()} 〜 {endDate.toLocaleDateString()}
        </Text>
      )}

      {/* 目標アイコン */}
      <Text style={styles.title}>
        <MaterialIcons name="flag-circle" size={70} color="#FFD700" />
      </Text>

      {/* 保存された目標を表示 */}
      <View style={styles.goalContainer}>
        <Text style={styles.goalText}>
          {savedGoal ? `目標 : ${savedGoal}` : "目標を入力してください"}
        </Text>
      </View>

      {/* 目標を入力するフィールド */}
      <TextInput
        style={styles.input}
        placeholder="目標を入力"
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
      <View style={styles.buttonGroup}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  section: {
    marginVertical: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
  },
  dateText: {
    fontSize: 18,
    color: "#007AFF",
    textAlign: "center",
    marginTop: 5,
  },
  dateRangeText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    width: "100%",
    marginVertical: 10,
    borderRadius: 10,
  },
  goalContainer: {
    backgroundColor: "#FFF8E1",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  goalText: {
    fontSize: 18,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "#9f9f9f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  firstMonthButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  secondMonthButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  thirdMonthButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonGroup: {
    width: "100%",
    marginTop: 15,
  },
});