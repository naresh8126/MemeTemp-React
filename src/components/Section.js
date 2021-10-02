import Card from "./Card";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const Section = () => {
  const [data, setData] = useState([]);
  const db = getFirestore();

  const getdata = async () => {
    const first = query(collection(db, "videos")); 
    // const first = query(collection(db, "videos"), limit(20)); 
    const data = await getDocs(first);
    let d = [];
    const lastVisible = data.docs[data.docs.length - 1];
    const next = query(
      collection(db, "videos"),
      startAfter(lastVisible),
      limit(2)
    );
    const nextData = await getDocs(next);

    data.forEach((doc) => {
      d.push(doc.data());
    });

    nextData.forEach((ndata) => {
      d.push(ndata.data());
    });
    console.log(nextData);
    shuffleArray(d);
    setData([...d]);
  };

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  useEffect(() => {
    getdata();
  }, []);

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
        {data.map((e) => {
          return (
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
          );
        })}
        <button onClick={getdata}>load more</button>
      </div>
      {/* </InfiniteScroll> */}
    </>
  );
};

export default Section;
