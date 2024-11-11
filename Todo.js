import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
import { db } from "./firebaseConfig";

export default function DailyTaskList({ period }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  // Firestoreからタスクを取得
  useEffect(() => {
    setLoading(true); // データ取得開始時にローディングを開始
    const tasksQuery = query(
      collection(db, `days/${period}/tasks`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
      setLoading(false); // データ取得完了時にローディングを停止
    });

    return () => unsubscribe();
  }, [period]);

  // Firestoreにタスクを追加
  const addTask = async () => {
    if (newTask.trim()) {
      await addDoc(collection(db, `days/${period}/tasks`), {
        title: newTask,
        completed: false,
        createdAt: serverTimestamp(),
      });
      setNewTask("");
    }
  };

  // Firestoreでタスクを削除
  const onDelete = async (taskId) => {
    await deleteDoc(doc(db, `days/${period}/tasks`, taskId));
  };

  // タスクの完了状態を切り替え
  const toggleTaskCompletion = async (taskId, currentStatus) => {
    await updateDoc(doc(db, `days/${period}/tasks`, taskId), {
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
    await updateDoc(doc(db, `days/${period}/tasks`, taskId), {
      title: editingText,
    });
    setEditingTaskId(null);
    setEditingText("");
  };

  const completionRate = tasks.length
    ? Math.round(
        (tasks.filter((task) => task.completed).length / tasks.length) * 100
      )
    : 0;

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
    <View style={styles.container}>
      <View
        style={[
          styles.dynamicBackground,
          {
            height: `${completionRate}%`, // 高さを completionRate に応じて変更
            backgroundColor: "#007AFF",
          },
        ]}
      />
      <View style={[styles.heightcolor]}>
        <Text style={styles.title}>Score: {completionRate}%</Text>
        <TextInput
          style={styles.input}
          placeholder="タスクを入力"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />
        <Button title="追加" onPress={addTask} />
        {loading ? ( // ローディング中の場合
          <ActivityIndicator
            size="large"
            color="#0074fe"
            style={styles.loadingIndicator}
          />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                <View style={styles.taskContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      toggleTaskCompletion(item.id, item.completed)
                    }
                  >
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
                    <Text
                      style={[
                        styles.taskText,
                        item.completed && styles.completedText,
                      ]}
                      onPress={() =>
                        toggleTaskCompletion(item.id, item.completed)
                      }
                    >
                      {item.title}
                    </Text>
                  )}
                  {editingTaskId === item.id ? (
                    <TouchableOpacity onPress={() => saveEditing(item.id)}>
                      <MaterialIcons name="check" size={24} color="#007AFF" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={() => startEditing(item)}>
                      <MaterialIcons name="edit" size={24} color="#007AFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </Swipeable>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f8f8f8", height: "100%" },
  dynamicBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // 下からの高さで調整
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, margin: 20},
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    margin: 10
  },
  loadingIndicator: {
    marginTop: 20,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    margin: 10
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
