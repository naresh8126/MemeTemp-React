import React, { useState, useEffect } from "react";
import { useParams, useRouteMatch, Link } from "react-router-dom";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

function Video() {
  const db = getFirestore();
  let { url } = useRouteMatch();
  const d = useParams();

  const [data, setData] = useState();
  const [sidedata, setSideData] = useState([]);
  async function addView(video, cviews) {
    // Add a new document in collection "cities"
    await updateDoc(doc(db, "videos", video), {
      views: cviews + 1,
    });
  }
  // console.log(name);
  const get = async () => {
    const querySnapshot = await getDocs(collection(db, "videos"));
    let d = [];
    querySnapshot.forEach((doc) => {
      d.push(doc.data());
    });
    setSideData([...d]);
  };

  async function getdata() {
    let { name } = d;
    const docRef = doc(db, "videos", name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: " + docSnap.data());
      addView(
        docSnap.data().videoName + docSnap.data().email,
        docSnap.data().views
      );

      setData(docSnap.data());

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  useEffect(() => {
    getdata();
    get();
  }, []);
  return (
    <>
      {/*  */}
      <div className=" flex flex-col sm:flex-row bg-gray-300 sm:p-8">
        <div className="w-full mb-8 sm:w-1/2">
          {/* <video className="bg-red-300 w-full" src=""></video> */}
          {data === undefined ? (
            ""
          ) : (
            <video
              className="bg-red-300 w-full"
              controls
              src={data.url}
            ></video>
          )}
          <div className="">information</div>
        </div>
        <div className="w-full  sm:w-1/2 sm:p-4 sm:p-12 sm:pr-0 sm:pt-0">
          {sidedata === undefined
            ? ""
            : sidedata.map((vid) => {
                return (
                  <Link
                    onClick={getdata}
                    to={"/video/" + vid.videoName + vid.email}
                    className="sm:hover:bg-gray-400 p-2 sm:flex w-full h-36 mb-4"
                  >
                    <img
                      alt=""
                      className="bg-red-300 sm:h-34 sm:w-auto w-full"
                      src={vid.thumbnail}
                    />
                    <div className="p-2">
                      <div className="text-lg font-medium">{vid.videoName}</div>
                      <div className="">@{vid.uploadedBy}</div>
                      <div className="">views {vid.views}</div>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </>
  );
}

export default Video;
