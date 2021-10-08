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
    shuffleArray(d);
    setSideData([...d]);
  };
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  async function getdata() {
    let { name } = d;
    const docRef = doc(db, "videos", name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: " + docSnap.data().videoName);
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
      <div className=" flex flex-col md:flex-row bg-gray-200 md:p-8">
        <div className="w-full mb-8 md:w-1/2">
          {/* <video className="bg-red-300 w-full" src=""></video> */}
          {data === undefined ? (
            ""
          ) : (
            <div>
              <div
                className="flex items-center justify-center bg-gray-900 w-full md:h-96"
                
              >
                <video className="h-60 md:h-full" controls src={data.url} controlsList="nodownload"></video>
              </div>

              <div className="p-2">
                <div className="text-lg font-medium">{data.videoName}</div>
                <div className="flex">
                  {" "}
                  <div className="">@{data.uploadedBy}</div>
                  <div className="">- views {data.views}</div>
                </div>
              </div>
              <hr />
            </div>

          )}
        </div>
        <div className="w-full  md:w-1/2 md:p-4 md:p-12 md:pr-0 md:pt-0">
          {sidedata === undefined
            ? ""
            : sidedata.map((vid) => {
                return (
                  <Link
                    to={"/video/" + vid.videoName + vid.email}
                    className="md:hover:bg-gray-400 p-2 md:flex w-full h-36 mb-4"
                    onClick={getdata}
                  >
                    <div
                      className="flex items-center justify-center bg-gray-900  md:h-auto md:w-60"
                      // style={{ width: "370px", height: "200px" }}
                    >
                      <img alt="" className="  h-full" src={vid.thumbnail} />
                    </div>

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
