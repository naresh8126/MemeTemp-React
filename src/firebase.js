// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2seZkX-N4IaRL4qJr4I-XnRDUwd5n5os",
  authDomain: "meme--temp.firebaseapp.com",
  databaseURL: "https://meme--temp-default-rtdb.firebaseio.com",
  projectId: "meme--temp",
  storageBucket: "meme--temp.appspot.com",
  messagingSenderId: "534525242115",
  appId: "1:534525242115:web:9a8f993a050ec81a141736",
  measurementId: "G-6ZE0NX8V4E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app