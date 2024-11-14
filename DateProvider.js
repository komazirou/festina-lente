// DateContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

const DateContext = createContext();

export function DateProvider({ children }) {
  const [startDate, setStartDate] = useState(null); // 開始日
  const [currentDay, setCurrentDay] = useState(0); // 現在の日数
  const [endDate, setEndDate] = useState(null); // 84日目の日付
  const [goal, setGoal] = useState(""); // 入力中の目標
  const [savedGoal, setSavedGoal] = useState(""); // 保存された目標
  const [inputGoal, setInputGoal] = useState(""); // 入力用の目標
  // Firestoreから開始日と目標を取得
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "Goal", "goal");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedGoal(data.goal || "");
        if (data.startDate) {
          const start = data.startDate.toDate();
          setStartDate(start);
          calculateDays(start);
        }
      } else {
        console.log("No such document!");
      }
    };
    fetchData();
  }, []);

  // 開始日をFirestoreに保存
  const saveStartDate = async (selectedDate) => {
    if (selectedDate) {
      const docRef = doc(db, "Goal", "goal");
      await setDoc(
        docRef,
        { startDate: Timestamp.fromDate(selectedDate) },
        { merge: true }
      );
      setStartDate(selectedDate);
      calculateDays(selectedDate);
    }
  };

  // 目標をFirestoreに保存
  const saveGoal = async (newGoal) => {
    if (newGoal.trim()) {
      const docRef = doc(db, "Goal", "goal");
      await setDoc(docRef, { goal: newGoal }, { merge: true });
      setSavedGoal(newGoal);
      setInputGoal("");
    }
  };

  // 経過日数と終了日を計算
  const calculateDays = (date) => {
    const today = new Date();
    const diffInDays = Math.floor((today - date) / (1000 * 3600 * 24)) + 1;
    setCurrentDay(diffInDays <= 84 ? diffInDays : 84);
    const calculatedEndDate = new Date(date);
    calculatedEndDate.setDate(calculatedEndDate.getDate() + 83);
    setEndDate(calculatedEndDate);
  };

  return (
    <DateContext.Provider
      value={{
        startDate,
        currentDay,
        endDate,
        goal,
        savedGoal,
        saveStartDate,
        saveGoal,
        setInputGoal,
        inputGoal,
      }}
    >
      {children}
    </DateContext.Provider>
  );
}

// カスタムフック
export function useDate() {
  return useContext(DateContext);
}
