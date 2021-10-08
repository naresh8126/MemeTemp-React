import Card from "./Card";
import InfiniteScroll from "react-infinite-scroll-component";
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
  // const [data, setData] = useState([]);
  // const getdata = async () => {
  //   const first = query(collection(db, "videos"));
  //   // const first = query(collection(db, "videos"), limit(20));
  //   const data = await getDocs(first);
  //   let d = [];
  //   const lastVisible = data.docs[data.docs.length - 1];
  //   const next = query(
  //     collection(db, "videos"),
  //     startAfter(lastVisible),
  //     limit(2)
  //   );
  //   const nextData = await getDocs(next);

  //   data.forEach((doc) => {
  //     d.push(doc.data());
  //   });

  //   nextData.forEach((ndata) => {
  //     d.push(ndata.data());
  //   });
  //   console.log(nextData);
  //   shuffleArray(d);
  //   setData([...d]);
  // };

  // function shuffleArray(array) {
  //   for (var i = array.length - 1; i > 0; i--) {
  //     var j = Math.floor(Math.random() * (i + 1));
  //     var temp = array[i];
  //     array[i] = array[j];
  //     array[j] = temp;
  //   }
  // }
  // useEffect(() => {
  //   getdata();
  // }, []);

  const [posts, setPosts] = useState([]);
  const [lastKey, setLastKey] = useState("");
  const [nextPosts_loading, setNextPostsLoading] = useState(false);

  useEffect(() => {
    // first 5 posts
    postsFirstBatch()
      .then((res) => {
        setPosts(res.posts);
        setLastKey(res.lastKey);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchMorePosts = (key) => {
    console.log("fetch more post ");
    console.log(key);
    setNextPostsLoading(true);
    getDocs(
      query(
        collection(db, "videos"),
        orderBy("views"),
        startAfter(key),
        limit(2)
      )
    )
      .then((data) => {
        console.log("data: " + data);
        let posts = [];
        
        data.forEach((doc) => {
          console.log(doc.data());
          posts.push(doc.data());
          setLastKey(doc.data().videoName + doc.data().email)
          console.log(lastKey);
          
        });
        function set(post) {
          setPosts(posts.concat(post));
          setNextPostsLoading(false);
          console.log("run");
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
      {/* <InfiniteScroll
        className="bg-gray-100"
        dataLength={data.length}
        next={getdata}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      > */}
      <div class="grid grid-cols-1 2xl:grid-cols-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-8 bg-gray-100">
        {allPosts}
        <button onClick={() => fetchMorePosts(lastKey)}>load more</button>
      </div>
      {/* </InfiniteScroll> */}
    </>
  );
};

const postsFirstBatch = async () => {
  try {
    const data = await getDocs(
      query(collection(db, "videos"), limit(2), orderBy("views"))
    );
    let posts = [];
    let lastKey = "";
    data.forEach((doc) => {
      console.log(doc.data());
      posts.push(doc.data());
      lastKey = doc.data().videoName + doc.data().email;
      console.log(lastKey);
    });

    return { posts, lastKey };
  } catch (e) {
    console.log(e);
  }
};



export default Section;
