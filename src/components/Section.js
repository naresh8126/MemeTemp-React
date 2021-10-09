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
import { useEffect, useState } from "react";
const db = getFirestore();

const Section = () => {
  const [posts, setPosts] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPostsloading, setNextPostsLoading] = useState(false);
  const [hasMore, sethasMore] = useState(true);
  const [size, setSize] = useState(0);

  useEffect(() => {
    // first 5 posts
    postsFirstBatch()
      .then((res) => {
        setPosts(res.posts);
        setLastKey(res.lastKey);
        setSize(res.size)
        console.log(size)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      console.log(posts.length)
      if (posts.length  !== size) {
        sethasMore(true)
      }else{
        sethasMore(false)
      }
      setTimeout(() => {
        setPosts(posts.concat(post));
      }, 1500);
    } catch (e) {
      console.log(e);
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
      <InfiniteScroll
        className="bg-gray-100"
        dataLength={posts.length}
        next={() => {
          fetchMorePosts(lastKey);
        }}
        hasMore={hasMore}
        loader={
          <div className="p-8" style={{ textAlign: "center" }}>
            <PulseLoader color={"#667eea"} loading={hasMore} size={20} />
          </div>
        }
        endMessage={<></>}
      >
        <div class="grid grid-cols-1 2xl:grid-cols-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-8 bg-gray-100">
          {allPosts}
        </div>
      </InfiniteScroll>
    </>
  );
};

const postsFirstBatch = async () => {
  try {
    const getSize = await getDocs(collection(db, "videos"));
    let size = getSize.size;
    const data = await getDocs(
      query(collection(db, "videos"), limit(4), orderBy("views"))
    );
    let posts = [];
    let lastKey = "";
    data.forEach((doc) => {
      console.log(doc.data());
      posts.push(doc.data());
      lastKey = doc;
      console.log(lastKey);
    });

    return { posts, lastKey, size };
  } catch (e) {
    console.log(e);
  }
};

export default Section;
