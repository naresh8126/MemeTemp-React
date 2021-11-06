// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8vf5LZYirWJf0XMjdaaLfz8JmIodkqAo",
  authDomain: "meme-cave.firebaseapp.com",
  projectId: "meme-cave",
  storageBucket: "meme-cave.appspot.com",
  messagingSenderId: "189959533109",
  appId: "1:189959533109:web:247a846eefdc9796e3f77c",
  measurementId: "G-504D9D3SWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app