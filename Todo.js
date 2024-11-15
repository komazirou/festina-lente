import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
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
  const animatedHeight = useRef(new Animated.Value(0)).current; // アニメーション用の高さ

  const completionRate = tasks.length
    ? Math.round(
        (tasks.filter((task) => task.completed).length / tasks.length) * 100
      )
    : 0;

  // アニメーションの効果
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: completionRate,
      duration: 800, // アニメーションの速度
      useNativeDriver: false,
    }).start();
  }, [completionRate]);

  // Firestoreからタスクを取得
  useEffect(() => {
    setLoading(true);
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
      setLoading(false);
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
      <Animated.View
        style={[
          styles.dynamicBackground,
          {
            height: animatedHeight.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: "#3ca03c", // 濃い緑色
            opacity: animatedHeight.interpolate({
              inputRange: [0, 100],
              outputRange: [0.1, 0.5], // 透明度の変化でグラデーション風に
            }),
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
        <View style={styles.addButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0074fe"
            style={styles.loadingIndicator}
          />
        ) : (
          <FlatList
            style={{ height: "75%" }}
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
  container: {
    backgroundColor: "#f2f2f2", // 背景色を柔らかいグレーに
    height: "100%",
    paddingHorizontal: 15,
  },
  dynamicBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
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
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#28a745", // 保存ボタンの色
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  activeDayButton: {
    backgroundColor: "#007AFF", // アクティブなボタンの色
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: "#ddd", // デフォルトのボタンの色
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButtonContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF", // アクセントカラー
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // 丸みを追加
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // Android用影
    width: "80%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10, // アイコンとテキストの間隔
  },
});
