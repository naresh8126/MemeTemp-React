import React, { useState, useEffect } from "react";
import { useParams, useRouteMatch, Link } from "react-router-dom";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  getDocs,
  getFirestore,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { BsDownload } from "react-icons/bs";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineShareAlt,
  AiTwotoneDislike,
  AiTwotoneLike,
} from "react-icons/ai";
import { IconContext } from "react-icons";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuth } from "../contexts/Auth";

function Video() {
  const { currentUser } = useAuth();
  const db = getFirestore();
  const storage = getStorage();
  let { url } = useRouteMatch();
  const d = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [realTimeData, setRealTimeData] = useState();
  const [sidedata, setSideData] = useState([]);

  useEffect(() => {
    let { name } = d;
    onSnapshot(doc(db, "videos", name), (doc) => {
      console.log("Current data: ", doc.data());
      setRealTimeData(doc.data());
    });
  }, []);

  // views--------------------------------------------------------------------------------------
  async function addView(video, cviews) {
    // Add a new document in collection "cities"
    await updateDoc(doc(db, "videos", video), {
      views: cviews + 1,
    });
  }

  // like function ======================================================================================
  function addLike() {
   
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
        likers: arrayUnion(currentUser.email),
        dislikers: arrayRemove(currentUser.email),
      });
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
        dislikes: data.dislikers.length,
        likes: data.likers.length,
      });
    
  }

  // dislike function====================================================================================
  function addDislike() {
   
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
        dislikers: arrayUnion(currentUser.email),
        likers: arrayRemove(currentUser.email),
      });
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
        dislikes: data.dislikers.length,
        likes: data.likers.length,
      });
    
  }

  // getting side videos data==============================================================================
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

  // getting main video data==================================================================
  async function getdata() {
    let { name } = d;
    const docRef = doc(db, "videos", name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: " + docSnap.data().videoName);
      addView(
        docSnap.data().videoName + docSnap.data().email.slice(0, -4),
        docSnap.data().views
      );

      setData(docSnap.data());
      setLoading(false);
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

  // download =================================================================================
  const download = (name) => {
    getDownloadURL(ref(storage, "videos/" + name))
      .then((url) => {
        var link = document.createElement("a");
        if (link.download !== undefined) {
          link.setAttribute("href", url);
          link.setAttribute("download", url);

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {loading ? (
        <div
          id="loader"
          className="bg-gray-100 w-screen h-screen flex justify-center	items-center"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : (
        <div className=" flex flex-col md:flex-row bg-gray-200 md:p-8">
          <div className="w-full mb-8 md:w-1/2">
            {/* <video className="bg-red-300 w-full" src=""></video> */}
            {data === undefined ? (
              ""
            ) : (
              <div>
                <div className="flex items-center justify-center bg-gray-900 w-full md:h-96">
                  <video
                    className="h-60 md:h-full"
                    autoPlay
                    controls
                    src={data.url}
                    controlsList="nodownload"
                  ></video>
                </div>

                <div className="p-2">
                  <div className="text-lg font-medium">{data.videoName}</div>
                  <div className="flex sm:justify-between flex-col sm:flex-row">
                    {" "}
                    <div>
                      <div className="">
                        <span className="text-red-700">@</span>
                        {data.uploadedBy}
                      </div>
                      <div className="">{realTimeData.views} views</div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <IconContext.Provider
                        value={{
                          color: "gray",
                          size: "40px",
                          className: "hover:bg-gray-300 p-2 rounded-lg m-1",
                        }}
                      >
                        <>
                          {realTimeData.likers.includes(currentUser.email) ? (
                            <AiTwotoneLike
                              onClick={() => {
                                addLike();
                              }}
                            />
                          ) : (
                            <AiOutlineLike
                              onClick={() => {
                                addLike();
                              }}
                            />
                          )}
                          {realTimeData.likers.length}
                          {realTimeData.dislikers.includes(
                            currentUser.email
                          ) ? (
                            <AiTwotoneDislike
                              onClick={() => {
                                addDislike();
                              }}
                            />
                          ) : (
                            <AiOutlineDislike
                              onClick={() => {
                                addDislike();
                              }}
                            />
                          )}

                          {realTimeData.dislikers.length}
                          <AiOutlineShareAlt />
                          <BsDownload
                            onClick={() => {
                              download(
                                data.videoName + data.email.slice(0, -4)
                              );
                            }}
                          />
                        </>
                      </IconContext.Provider>
                    </div>
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
                      to={"/video/" + vid.videoName + vid.email.slice(0, -4)}
                      className="md:hover:bg-gray-300 p-2 md:flex w-full h-36 mb-4"
                      onClick={getdata}
                    >
                      <div
                        className="flex items-center justify-center bg-gray-900 h-60 md:h-full md:w-1/2"
                        // style={{ width: "370px", height: "200px" }}
                      >
                        <img alt="" className="h-full" src={vid.thumbnail} />
                      </div>

                      <div className="p-2 md:w-1/2">
                        <div className="text-lg font-medium">
                          {vid.videoName}
                        </div>
                        <div className="">@{vid.uploadedBy}</div>
                        <div className="">views {vid.views} </div>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>
      )}
    </>
  );
}

export default Video;
