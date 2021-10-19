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
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/Auth";
import { Link } from "react-router-dom";
import { MdEdit, MdDeleteForever } from "react-icons/md";

const db = getFirestore();

const Profile = (props) => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPostsloading, setNextPostsLoading] = useState(false);
  const [hasMore, sethasMore] = useState(true);
  const [size, setSize] = useState(0);

  useEffect(() => {
    // first 5 posts
    postsFirstBatch(currentUser)
      .then((res) => {
        setPosts(res.posts);
        setLastKey(res.lastKey);
        setSize(res.size);
        console.log(size);
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
          startAfter(key),
          where("email", "==", currentUser.email)
        )
      );
      let post = [];
      data.forEach((doc) => {
        post.push(doc.data());
        setLastKey(doc);
      });
      console.log(posts.length);
      if (posts.length !== size) {
        sethasMore(true);
      } else {
        sethasMore(false);
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
            <Link
              to={"/video/" + e.name + e.email.slice(0, -4)}
              class=" each mb-10 sm:m-2 md:border md:border-gray-200 bg-gray-100 relative block duration-500  transition-all  md:hover:border-purple-800 "
            >
              <div
                className="flex items-center justify-center bg-gray-900"
                style={{ width: "100%", height: "200px" }}
              >
                <img class="h-full" src={e.thumbnail} alt="" />
              </div>
              <div class="badge absolute top-0 right-0 bg-indigo-500 m-1 text-gray-200 p-1 px-2 text-xs font-bold rounded">
                {parseInt(e.duration)}s
              </div>
              <div className="absolute top-0 left-0">
                <div class="badge  bg-red-500 m-1 text-gray-100 p-1 px-2 text-md font-bold rounded hover:bg-red-800">
                  <MdDeleteForever
                    onClick={() => {
                      alert("hello");
                    }}
                  />
                </div>
                <div class="badge  bg-green-500 m-1 text-gray-100 p-1 px-2 text-md font-bold rounded hover:bg-green-800">
                  <MdEdit
                    onClick={() => {
                      alert("hello");
                    }}
                  />
                </div>
              </div>

              <div class="info-box text-xs flex p-1 font-semibold text-gray-500 bg-gray-300">
                <span class="mr-1 p-1 px-2 font-bold">{e.views} views</span>
                <span class="mr-1 p-1 px-2 font-bold border-l border-gray-400">
                  {e.likes} Likes
                </span>
                <span class="mr-1 p-1 px-2 font-bold border-l border-gray-400">
                  {e.dislikes} Dislikes
                </span>
              </div>
              <div class="desc p-4 text-gray-800">
                <Link
                  to="/"
                  class="title font-bold block cursor-pointer hover:underline"
                >
                  {e.videoName}
                </Link>
                <span class="description text-sm block py-2 border-gray-400 mb-2"></span>
              </div>
            </Link>
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
            <PulseLoader color={"#b5b5b5"} loading={hasMore} size={20} />
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

const postsFirstBatch = async (c) => {
  const currentUser = c;
  try {
    const getSize = await getDocs(collection(db, "videos"));
    let size = getSize.size;
    const data = await getDocs(
      query(
        collection(db, "videos"),
        limit(8),
        orderBy("views"),
        where("email", "==", currentUser.email)
      )
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

export default Profile;
