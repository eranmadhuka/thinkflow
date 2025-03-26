// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDB5_3P5tAVSHWgPy4rZP75GjMeuiZkEuw",
    authDomain: "thinkflow-60699.firebaseapp.com",
    projectId: "thinkflow-60699",
    storageBucket: "thinkflow-60699.firebasestorage.app",
    messagingSenderId: "48013714648",
    appId: "1:48013714648:web:969d5e5bc4a3125f7d23ad",
    measurementId: "G-65R5YVHCM8"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };