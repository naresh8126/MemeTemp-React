import React, { useContext, useState, useEffect } from "react";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useHistory } from "react-router";

const provider = new GoogleAuthProvider();
const db = getFirestore();
const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const history = useHistory();
  const auth = getAuth();
  const [currentUser, setcurrentUser] = useState();
  
 
 
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
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage);
    }
  }
  const Login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    try {
      console.log("user logged in", userCredential.user);
    } catch (error) {
      const errorMessage = error.message;
    }
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
    }
  };
  const SignOut = async () => {
    try {
      await signOut(auth);
      history.push("/");
      console.log("logged out");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setcurrentUser(auth.currentUser);
        console.log(auth.currentUser)
      } else {
        console.log("no user logged in")
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
