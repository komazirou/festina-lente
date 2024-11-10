import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

export default function DailyTaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const renderRightActions = (taskId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(taskId)}
      >
        <Text style={styles.deleteButtonText}>削除</Text>
      </TouchableOpacity>
    );
  };

  const onDelete = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), title: newTask, completed: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  const saveEditing = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: editingText } : task
      )
    );
    setEditingTaskId(null);
    setEditingText("");
  };

  const completionRate = tasks.length
    ? Math.round(
        (tasks.filter((task) => task.completed).length / tasks.length) * 100
      )
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Score: {completionRate}%</Text>
      <TextInput
        style={styles.input}
        placeholder="タスクを入力"
        value={newTask}
        onChangeText={setNewTask}
        onSubmitEditing={addTask} // 修正: ここでタスクを追加
      />
      <Button title="追加" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.taskContainer}>
              <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
                <MaterialIcons
                  name={
                    item.completed ? "check-box" : "check-box-outline-blank"
                  }
                  size={24}
                  color={"green"}
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
                <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.completedText,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )}

              {editingTaskId === item.id ? (
                <TouchableOpacity onPress={() => saveEditing(item.id)}>
                  <MaterialIcons name="check" size={24} color="#0074fe" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => startEditing(item)}>
                  <MaterialIcons name="edit" size={24} color="#0074fe" />
                </TouchableOpacity>
              )}
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f8f8", height: "100%" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
  },
  taskText: {
    fontSize: 18,
    marginLeft: 10,
  },
  completedText: { textDecorationLine: "line-through", color: "gray" },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
}); 