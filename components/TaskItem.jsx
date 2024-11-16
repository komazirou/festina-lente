import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Swipeable, TextInput } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

export default function TaskInput({
  item,
  onDelete,
  toggleTaskCompletion,
  editingTaskId,
  saveEditing,
  startEditing,
  editingText,
  setEditingText,
}) {
  // 削除ボタンの表示
  const renderRightActions = (taskId) => (
    <TouchableOpacity
      onPress={() => onDelete(taskId)}
      style={styles.deleteButton}
    >
      <Text style={styles.deleteButtonText}>削除</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.taskContainer}>
        <TouchableOpacity
          onPress={() => toggleTaskCompletion(item.id, item.completed)}
        >
          <MaterialIcons
            name={item.completed ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={"#3ca03c"}
          />
        </TouchableOpacity>
        {editingTaskId === item.id ? (
          <TextInput
            style={styles.input}
            value={editingText}
            onChangeText={setEditingText}
            onSubmitEditing={() => saveEditing(item.id)}
          />
        ) : (
          <Text
            style={[styles.taskText, item.completed && styles.completedText]}
            onPress={() => toggleTaskCompletion(item.id, item.completed)}
          >
            {item.title}
          </Text>
        )}

        <TouchableOpacity onPress={() => startEditing(item)}>
          <MaterialIcons name="edit" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff", // カードスタイル
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Android用影
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  deleteButton: {
    backgroundColor: "#dd003c", // 削除ボタンの色
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // Android用影
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
