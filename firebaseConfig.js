import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";

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

// Firestore のインスタンスの取得または初期化、キャッシュ設定を使用
const db = getApps().length
  ? getFirestore(app)  // すでに初期化されている場合、getFirestoreで取得
  : initializeFirestore(app, {
      localCache: persistentLocalCache(), // ローカルキャッシュの設定
      experimentalForceLongPolling: true, // ネットワークの安定性を確保
      useFetchStreams: false,
    });

export { db };
