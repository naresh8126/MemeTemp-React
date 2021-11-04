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
} from "firebase/firestore";
import fic from '../static/fic.png'
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
const db = getFirestore();

const Section = (props) => {
  document.title = "IceMemes"
  const [posts, setPosts] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPostsloading, setNextPostsLoading] = useState(false);
  const [hasMore, sethasMore] = useState(true);
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // first 5 posts
    postsFirstBatch()
      .then((res) => {
        setPosts(res.posts);
        setLastKey(res.lastKey);
        setSize(res.siz);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e)
      });
  }, []);

  const postsFirstBatch = async () => {
    try {
      const getSize = await getDocs(collection(db, "videos"));
      let siz = getSize.size;
      const data = await getDocs(
        query(collection(db, "videos"), limit(8), orderBy("views"))
      );
      let posts = []; 
      let lastKey = "";
      data.forEach((doc) => {
        posts.push(doc.data());
        lastKey = doc;
      });
      if (siz===posts.length) {
        sethasMore(false)
      } else {
        sethasMore(true)
      }
      return { posts, lastKey, siz };
    } catch (e) {
      toast.error(e)
    }
  };

  const fetchMorePosts = async (key) => {
    setNextPostsLoading(true);
    try {
      const data = await getDocs(
        query(
          collection(db, "videos"),
          limit(4),
          orderBy("views"),
          startAfter(key)
        )
      );
      let post = [];
      data.forEach((doc) => {
        post.push(doc.data());
        setLastKey(doc);
      });
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
      toast.catch(e)
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
      ) : (
        posts.length !== 0 ?
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
          <div className="grid grid-cols-1 2xl:grid-cols-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-8" style={{backgroundColor:"#191c23"}}>
            {allPosts}
          </div>
        </InfiniteScroll>:<div className=" w-full flex justify-center	 items-center	 h-screen" style={{backgroundColor:"white"}}><img src={fic} alt="error" width="300px" /></div>
      )}
    </>
  );
};



export default Section;
