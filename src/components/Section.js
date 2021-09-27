import Card from "./Card";

import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

const Section = () => {
 
  const [data, setData] = useState(
    []
  );
  const db = getFirestore();
  const getdata = async () => {
    const querySnapshot = await getDocs(collection(db, "videos"));
    let d = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // setData([...data, doc.data()]);
      d.push(doc.data())
    });
    setData([...d])
  };
  useEffect(() => {
    getdata();
  }, []);
  return (
    <>
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
        {console.log(data)}
      </div>
    </>
  );
};

export default Section;
