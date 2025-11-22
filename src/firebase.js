// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// 🆕 Importaciones necesarias para Firestore
import { getFirestore, serverTimestamp } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAMrbphACHT2GBPm_1M7Rhqht6qCAFRbBI",
  authDomain: "jewerly-d7a06.firebaseapp.com",
  projectId: "jewerly-d7a06",
  storageBucket: "jewerly-d7a06.appspot.com",
  messagingSenderId: "295404012801",
  appId: "1:295404012801:web:1526a2804ed055c3f20700"
};

// Inicializar la aplicación
const app = initializeApp(firebaseConfig);

// Inicializar y exportar Firebase Auth
export const auth = getAuth(app);

// ✅ ARREGLO: Inicializar y exportar la Base de Datos (Firestore)
export const db = getFirestore(app); 

// ✅ ARREGLO: Exportar serverTimestamp
export { serverTimestamp };