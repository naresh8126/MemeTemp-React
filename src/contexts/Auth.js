import React, { useContext, useState, useEffect } from "react";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
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

      history.push("/");
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  }
  const Login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      history.push("/");
    } catch (error) {
      return error;
    }
  };
  const Register = async (username, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setDoc(doc(db, "users", email), {
        displayName: username,
        email: email,
      });
      updateProfile(result.user, {
        displayName: username,
      })
        .then(() => {
          history.push("/");
        })
        .catch((error) => {});
        setcurrentUser(auth.currentUser);
    } catch (error) {
      const errorMessage = error.message;
      return error;
    }
  };
  const SignOut = () => {
    signOut(auth)
      .then((userCredential) => {
        console.log(userCredential);
        setcurrentUser("");
        history.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // ..
      });
  };
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setcurrentUser(user);
        console.log(currentUser);
      } else {
        setcurrentUser("");
      }
    });
  }, []);
  const value = {
    currentUser,
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
