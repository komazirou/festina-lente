import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";

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

import TaskInput from "./components/TaskInput";
import TaskItem from "./components/TaskItem";
import CompletionBar from "./components/CompletionBar";

export default function DailyTaskList({ period }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const completionRate = tasks.length
    ? Math.round(
        (tasks.filter((task) => task.completed).length / tasks.length) * 100
      )
    : 0;

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

  const onDelete = async (taskId) => {
    await deleteDoc(doc(db, `days/${period}/tasks`, taskId));
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    await updateDoc(doc(db, `days/${period}/tasks`, taskId), {
      completed: !currentStatus,
    });
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
    setNewTask(task.title);
  };

  const saveEditing = async () => {
    if (newTask.trim() && editingTaskId) {
      await updateDoc(doc(db, `days/${period}/tasks`, editingTaskId), {
        title: newTask,
      });
      setEditingTaskId(null);
      setNewTask("");
    }
  };

  return (
    <View style={styles.container}>
      <CompletionBar completionRate={completionRate} />
      <TaskInput
        newTask={newTask}
        setNewTask={setNewTask}
        addTask={addTask}
        completionRate={completionRate}
        isEditing={editingTaskId !== null}
        saveEditing={saveEditing}
        
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 25 }}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onDelete={onDelete}
              toggleTaskCompletion={toggleTaskCompletion}
              editingTaskId={editingTaskId}
              startEditing={startEditing}
              editingText={editingText}
              setEditingText={setEditingText}
              saveEditing={saveEditing}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 15,
    backgroundColor: "#F8F9FA", // 優しいグレーで背景を統一
  },
  loadingIndicator: {
    marginTop: 20,
  },
});
