import Card from "./Card";
import PulseLoader from "react-spinners/PulseLoader";
import Sec from "./Sec";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {useLocation} from "react-router-dom"
const db = getFirestore();

const Section = () => {
  const [sParams, setsParams] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    postsFirstBatch();
  }, [location]);
  
  const postsFirstBatch = async () => {
    try {
      let params = new URLSearchParams(window.location.search);
      let q = await params.get("q").toUpperCase();
      setsParams(params.get("q"));
      console.log(q);
      const searchQ = q.split(" ");
      console.log(searchQ);
      const videoRef = collection(db, "videos");

      const data = await getDocs(
        query(videoRef, where("title", "array-contains-any", searchQ))
      );
      let posts = [];
      console.log("fetched");
      data.forEach((doc) => {
        posts.push(doc.data());
      });
      console.log(data);
      setPosts(posts);
      setLoading(false);
    } catch (e) {
      toast.error(e);
      console.log(e);
    }
  };

  const allPosts = (
    <>
      {posts.map((e) => {
        return (
          <div>
            <Card
              video={e}
            />
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      {loading ? (
        <div
          id="loader"
          className="bg-gray-900 w-full h-screen flex justify-center items-center m-0"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : (
        <Sec
          title={"Search term: " + sParams}
          content={
            <div
              className="grid grid-cols-1 2xl:grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 "
              style={{ backgroundColor: "#191c23" }}
            >
              {allPosts}
            </div>
          }
          link="" 
        />
      )}
    </>
  );
};

export default Section;
