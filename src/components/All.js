import Card from "./Card";
import InfiniteScroll from "react-infinite-scroll-component";
import PulseLoader from "react-spinners/PulseLoader";
import { useLocation, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  startAfter,
  orderBy,
} from "firebase/firestore";
import fic from "../static/fic.png";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import Sec from "./Sec";
const db = getFirestore();

const All = (props) => {
  const [title, settitle] = useState("");
  const d = useParams();
  let { type } = d;
  
  document.title = type+" Memes - Meme Cave";
  const [posts, setPosts] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPostsloading, setNextPostsLoading] = useState(false);
  const [hasMore, sethasMore] = useState(true);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    settitle(type);
    postsFirstBatch()
      .then((res) => {
        setPosts(res.posts);
        setLastKey(res.lastKey);
        setSize(res.siz);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e);
      });
  }, []);
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  const postsFirstBatch = async () => {
    try {
      const getSize = await getDocs(collection(db, "videos"));
      let siz = getSize.size;
      let data,
        lastKey = "",
        posts = [];

      switch (type) {
        case "featured":
          data = await getDocs(query(collection(db, "videos"), limit(8)));
          data.forEach((doc) => {
            posts.push(doc.data());
            lastKey = doc;
          });
          shuffle(posts);
          break;

        case "latest":
          data = await getDocs(
            query(
              collection(db, "videos"),
              orderBy("timestamp", "desc"),
              limit(8)
            )
          );
          data.forEach((doc) => {
            posts.push(doc.data());
            lastKey = doc;
          });
          break;

        case "mostLiked":
          data = await getDocs(
            query(
              collection(db, "videos"),
              orderBy("likes", "desc"),
              limit(8)
            )
          );
          data.forEach((doc) => {
            posts.push(doc.data());
            lastKey = doc;
          });
          break;

        case "mostPopular":
          data = await getDocs(
            query(
              collection(db, "videos"),
              orderBy("views", "desc"),
              limit(8)
            )
          );
          data.forEach((doc) => {
            posts.push(doc.data());
            lastKey = doc;
          });
          break;

        case "random":
          data = await getDocs(
            query(
              collection(db, "videos"),
          
              limit(8)
            )
          );
          data.forEach((doc) => {
            posts.push(doc.data());
            lastKey = doc;
          });
          shuffle(posts)
          break;

        case "longest":
          break;

        default:
          break;
      }
      if (siz === posts.length) {
        sethasMore(false);
      } else {
        sethasMore(true);
      }
      return { posts, lastKey, siz };
    } catch (e) {
      toast.error(e);
    }
  };

  const fetchMorePosts = async (key) => {
    setNextPostsLoading(true);
    let data, post = [];
    try {
      switch (type) {
        case "featured":
          data = await getDocs(
            query(
              collection(db, "videos"),
              limit(4),
              orderBy("views", "desc"),
              startAfter(key)
            )
          );
          data.forEach((doc) => {
            post.push(doc.data());
            setLastKey(doc);
          });
          shuffle(post)
          break;
      
        case "latest":
          data = await getDocs(
            query(
              collection(db, "videos"),
              limit(4),
              orderBy("timestamp", "desc"),
              startAfter(key),
            )
          );
          data.forEach((doc) => {
            post.push(doc.data());
            setLastKey(doc);
          });
          
          break;
      
        case "mostLiked":
          data = await getDocs(
            query(
              collection(db, "videos"),
              limit(4),
              orderBy("likes", "desc"),
              startAfter(key),
            )
          );
          data.forEach((doc) => {
            post.push(doc.data());
            setLastKey(doc);
          });
          
          break;
      
        case "mostPopular":
          data = await getDocs(
            query(
              collection(db, "videos"),
              limit(4),
              orderBy("views", "desc"),
              startAfter(key),
            )
          );
          data.forEach((doc) => {
            post.push(doc.data());
            setLastKey(doc);
          });
          
          break;
      
        case "random":
          data = await getDocs(
            query(
              collection(db, "videos"),
              limit(4),
              orderBy("views", "desc"),
              startAfter(key)
            )
          );
          data.forEach((doc) => {
            post.push(doc.data());
            setLastKey(doc);
          });
          shuffle(post)
          break;
      
       
      
        default:
          break;
      }
      setSize(size + post.length);
      if (posts.length !== size) {
        sethasMore(true);
      } else {
        sethasMore(false);
      }
      setTimeout(() => {
        setPosts(posts.concat(post));
      }, 1500);
    } catch (e) {
      console.log(e)
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
          className="bg-gray-900 w-full h-screen flex justify-center items-center m-0"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : posts.length !== 0 ? (
        <Sec
          title={title.toUpperCase()+ " MEMES"}
          link=""
          content={
            <InfiniteScroll
              className=""
              dataLength={posts.length}
              next={() => {
                fetchMorePosts(lastKey);
              }}
              hasMore={hasMore}
              loader={
                <div className="p-8" style={{ textAlign: "center" }}>
                  <PulseLoader color={"#b5b5b5"} loading={hasMore} size={20} />
                </div>
              }
              endMessage={<></>}
            >
              <div
                className="grid grid-cols-1 2xl:grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 sm:p-8"
                style={{ backgroundColor: "#191c23" }}
              >
                {allPosts}
              </div>
            </InfiniteScroll>
          }
        />
      ) : (
        <div
          className=" w-full flex justify-center	 items-center	 h-screen"
          style={{ backgroundColor: "white" }}
        >
          <img src={fic} alt="error" width="300px" />
        </div>
      )}
    </>
  );
};

export default All;
