// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNPvjCme01FAOTLmQrew2B8FZln0Zywqc",
  authDomain: "ice-memes.firebaseapp.com",
  projectId: "ice-memes",
  storageBucket: "ice-memes.appspot.com",
  messagingSenderId: "823294477650",
  appId: "1:823294477650:web:2f2569e2ce496e5f8ca68b",
  measurementId: "G-P41TP652W4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app