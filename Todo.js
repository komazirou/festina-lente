import React, { useState, useEffect } from "react";
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
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"; 
import { db } from './firebaseConfig';

export default function DailyTaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Firestoreからタスクを取得
  const fetchTasks = () => {
    const tasksQuery = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });
  };

  // Firestoreにタスクを追加
  const addTask = async () => {
    if (newTask.trim()) {
      await addDoc(collection(db, "tasks"), {
        title: newTask,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setNewTask("");
    }
  };

  // Firestoreでタスクを削除
  const onDelete = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  // タスクの完了状態を切り替え
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: !currentStatus,
    });
  };

  // 編集モードの開始
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  // 編集内容の保存
  const saveEditing = async (taskId) => {
    await updateDoc(doc(db, "tasks", taskId), {
      title: editingText,
    });
    setEditingTaskId(null);
    setEditingText("");
  };

  const completionRate = tasks.length
    ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100)
    : 0;

  // 削除ボタンの表示
  const renderRightActions = (taskId) => (
    <TouchableOpacity onPress={() => onDelete(taskId)} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>削除</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Score: {completionRate}%</Text>
      <TextInput
        style={styles.input}
        placeholder="タスクを入力"
        value={newTask}
        onChangeText={setNewTask}
        onSubmitEditing={addTask}
      />
      <Button title="追加" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.taskContainer}>
              <TouchableOpacity onPress={() => toggleTaskCompletion(item.id, item.completed)}>
                <MaterialIcons
                  name={item.completed ? "check-box" : "check-box-outline-blank"}
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
                <Text style={[styles.taskText, item.completed && styles.completedText]}>
                  {item.title}
                </Text>
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
