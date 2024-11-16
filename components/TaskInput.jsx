import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function TaskInput({
  newTask,
  setNewTask,
  addTask,
  completionRate,
  saveEditing,
  isEditing, // 編集中かどうかを示すフラグ
}) {
  return (
    <View
      style={[
        styles.container,
        isEditing && styles.editingContainer, // 編集中のスタイルを適用
      ]}
    >
      <Text style={styles.title}>
        {isEditing ? "編集中..." : `Score: ${completionRate}%`}
      </Text>
      <TextInput
        style={[styles.input, isEditing && styles.editingInput]} // 編集中の入力スタイル
        placeholder="タスクを入力してください"
        value={newTask}
        onChangeText={setNewTask}
        onSubmitEditing={addTask}
      />
      <TouchableOpacity
        style={[styles.addButton, isEditing && styles.editingButton]} // 編集中のボタンスタイル
        onPress={isEditing ? saveEditing : addTask}
      >
        <MaterialIcons
          name={isEditing ? "edit" : "add"} // 編集中の場合はアイコンを変更
          size={24}
          color="#fff"
        />
        <Text style={styles.addButtonText}>{isEditing ? "保存" : "追加"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  editingContainer: {
    backgroundColor: "#f5f5f5", // 編集中の場合の背景色
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: "#007AFF", // 編集中の際の目立つ枠線
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  editingInput: {
    borderColor: "#007AFF", // 編集中の際の入力フィールドの枠線
    backgroundColor: "#e6f0ff", // 編集中の際の背景色
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  editingButton: {
    backgroundColor: "#0056b3", // 編集中の場合のボタン色を濃くする
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
