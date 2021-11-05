import Card from "./Card";
import InfiniteScroll from "react-infinite-scroll-component";
import PulseLoader from "react-spinners/PulseLoader";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  startAfter,
  orderBy,
  where,
} from "firebase/firestore";
import fic from "../static/fic.png";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
const db = getFirestore();

const Section = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    postsFirstBatch();
  }, []);
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  const postsFirstBatch = async () => {
    try {
      const videoRef = collection(db, "videos");

      if (props.orderBy === "random") {
        const data = await getDocs(
          query(videoRef, limit(6))
        );
        let posts = [];
        data.forEach((doc) => {
          posts.push(doc.data());
        });
        setPosts(shuffle(posts));
        setLoading(false);
      } else {
        const data = await getDocs(
          query(videoRef, orderBy(props.orderBy, "desc"), limit(6))
        ); 
        let posts = [];
        data.forEach((doc) => {
          posts.push(doc.data());
        });
        setPosts(posts);
        setLoading(false);
      }
    } catch (e) {
      toast.error(e);
    }
  };

  const allPosts = (
    <>
      {posts.map((e) => {
        return (
          <div>
            <Card
              name={e.videoName}
              email={e.email}
              uploaderName={e.uploadedBy}
              uploadTime=""
              thumbnail={e.thumbnail}
              download={e.url}
              duration={parseInt(e.duration)}
              likes={e.likes}
              views={e.views}
              dislikes={e.dislikes}
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
          className="bg-800 w-full h-screen flex justify-center items-center m-0"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : (
        <div
          className="grid grid-cols-1 2xl:grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 "
          style={{ backgroundColor: "#191c23" }}
        >
          {allPosts}
        </div>
      )}
    </>
  );
};

export default Section;
