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
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { useNavigate, useLocation } from "react-router-dom";
const provider = new GoogleAuthProvider();
const db = getFirestore();
const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const location = useLocation();
  const Navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setcurrentUser(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setuserData(docSnap.data());
          console.log("chenged4");
        } else {
        }
        console.log(currentUser);
      } else {
        setcurrentUser("");
      }
    });
  }, [location]);

  const auth = getAuth();
  const [currentUser, setcurrentUser] = useState("");
  const [userData, setuserData] = useState("");
  async function signWthGoogle() {
    const result = await signInWithPopup(auth, provider);
    try {
      const user = result.user;
      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        // The user is new, show them a fancy intro screen!
        setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          ig: "",
          bio: "",
          banner: "",
          uploads: 0,
          followers: [],
          following: [],
        });
      } else {
        updateDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          
        });
      }

      Navigate("/");
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

      Navigate("/");
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
      console.log("registerd");
      console.log(result.user.uid);
      setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        displayName: username,
        email: email,
        ig: "",
        bio: "",
        banner: "",
        photoURL: "",
        uploads: 0,
        followers: [],
        following: [],
      });
      updateProfile(result.user, {
        displayName: username,
      })
        .then(() => {
          // Navigate("/")
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
        Navigate("/");
      })
      .catch((error) => {});
  };

  const value = {
    userData,
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
