import React, { useContext, useState, useEffect } from "react";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useHistory } from "react-router";
import Alert from "../components/Alert";
const provider = new GoogleAuthProvider();
const db = getFirestore();
const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const history = useHistory();
  const auth = getAuth();
  const [currentUser, setcurrentUser] = useState("");

  async function signWthGoogle() {
    const result = await signInWithPopup(auth, provider);
    try {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      setDoc(doc(db, "users", user.email), {
        username: user.displayName,
        email: user.email,
      });
      console.log(user);
      console.log("user logged in by google");
      history.push("/");
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  }
  const Login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("user logged in", userCredential.user);

        history.push("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  const Register = async (username, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    try {
      setDoc(doc(db, "users", email), {
        username: username,
        email: email,
      });
      result.user.displayName = username;
      console.log("user registered", result.user);
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };
  const SignOut = () => {
    signOut(auth)
      .then((userCredential) => {
        history.push("/");
        setcurrentUser("");
        console.log("logged out");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  };
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentUser(auth.currentUser);
        console.log(auth.currentUser);
      } else {
        console.log("no user logged in");
      }
    });
  }, []);
  const value = {
    currentUser,
    setcurrentUser,
    Login,
    Register,
    SignOut,
    signWthGoogle,
  };
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
