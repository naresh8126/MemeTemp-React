import React from "react";
import pic from "./user.png";
import bgmage from "./bg.jpg";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  getDocs,
  getFirestore,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  query,
  limit,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

function ProfileInfo(props) {
  const db = getFirestore();
  const { currentUser } = useAuth();
  function unFollow() {
    try {
      updateDoc(doc(db, "users", props.user.uid), {
        followers: arrayRemove(currentUser.uid),
      });
      updateDoc(doc(db, "users", currentUser.uid), {
        following: arrayRemove(props.user.uid),
      });
      toast.success("You Unfollowed " + props.user.displayName);
    } catch (error) {
      toast.error("Please login to unfollow");
    }
  }
  // unfollow function ======================================================================================
  function follow() {
    try {
      updateDoc(doc(db, "users", props.user.uid), {
        followers: arrayUnion(currentUser.uid),
      });
      updateDoc(doc(db, "users", currentUser.uid), {
        following: arrayUnion(props.user.uid),
      });
      toast.success("You Followed " + props.user.displayName);
    } catch (error) {
      toast.error("Please login to follow");
    }
  }
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <div
        style={{
          background: `url(${props.user.banner || bgmage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        className="h-64 w-full bg-gray-900 flex items-center justify-center text-gray-100 relative"
      >
        <div className="flex items-center justify-center flex-col">
          <img
            width="75px"
            height="75px"
            src={props.user.photoURL || pic}
            alt=""
            className="rounded-full  "
          />
          <h1 className="bg-opacity-75 font-blod text-2xl bg-gray-900 m-2 p-2 rounded-md">
            {props.user.displayName}
          </h1>
          <div className="font-light flex absolute left-0 bottom-0 p-2 bg-gray-900 bg-opacity-75 filter drop-shadow-lg">
            <div className="mr-8">
              <span className="font-bold">{props.user.uploads}</span> Posts
            </div>
            <Link
              to={`/user/${props.user.uid}/followers`}
              className="mr-8 hover:underline"
            >
              <span className="font-bold">{props.user.followers.length}</span>{" "}
              followers
            </Link>
            <Link
              to={`/user/${props.user.uid}/following`}
              className="hover:underline"
            >
              <span className="font-bold">{props.user.following.length}</span>{" "}
              following
            </Link>
          </div>
        </div>
        {currentUser.uid === props.user.uid ? (
          <Link
            to="/profile/edit"
            className="absolute right-4 top-4 p-2 px-4 bg-blue-700 hover:bg-blue-800"
          >
            Edit Profile
          </Link>
        ) : (
          <>
          
            {props.user.followers.includes(currentUser.uid) ? (
              <button
                className="absolute right-4 top-4 bg-gray-500 hover:bg-gray-700  p-2 px-4"
                onClick={() => {
                  unFollow();
                }}
              >
                unFollow
              </button>
            ) : (
              <button
                className="absolute right-4 top-4 bg-blue-500 hover:bg-blue-600  p-2 px-4"
                onClick={() => {
                  follow();
                }}
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileInfo;
