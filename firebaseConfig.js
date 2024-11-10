import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDF7n2EB4w_SnOGWUb6puRcHIL8yxcvvkU",
    authDomain: "festina-lente-55274.firebaseapp.com",
    projectId: "festina-lente-55274",
    storageBucket: "festina-lente-55274.firebasestorage.app",
    messagingSenderId: "85274766934",
    appId: "1:85274766934:web:0806ba6c1493b4599ed5f7",
    measurementId: "G-QL7QWLY3N6",
};

// Firebase アプリの初期化
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore のインスタンスの取得または初期化
let db;
try {
  db = getFirestore(app);
} catch (error) {
  console.log("Firestore の初期化エラー:", error);
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  });
}

export { db };
