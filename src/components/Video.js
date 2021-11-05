import React, { useState, useEffect } from "react";
import { useParams, useRouteMatch, Link, useLocation } from "react-router-dom";
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
import { ToastContainer, toast } from "react-toastify";
import Sec from "./Sec";

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
  const location = useLocation();
  const { currentUser } = useAuth();
  const db = getFirestore();
  const d = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [realTimeData, setRealTimeData] = useState();
  const [sidedata, setSideData] = useState([]);

  useEffect(() => {
    let { name } = d;
    onSnapshot(doc(db, "videos", name), (doc) => {
      setRealTimeData(doc.data());
    });
  }, [location]);

  // views--------------------------------------------------------------------------------------
  async function addView(video, cviews) {
    // Add a new document in collection "cities"
    await updateDoc(doc(db, "videos", video), {
      views: cviews + 1,
    });
  }

  // like function ======================================================================================
  async function addLike() {
    try {
      await updateDoc(
        doc(db, "videos", data.videoName),
        {
          likers: arrayUnion(currentUser.email),
          dislikers: arrayRemove(currentUser.email),
        }
      );
      updateDoc(doc(db, "videos", data.videoName), {
        dislikes: data.dislikers.length,
        likes: data.likers.length,
      });
    } catch (error) {
      toast.error("Please LogIn to like this video");
    }
  }

  // dislike function====================================================================================
  async function addDislike() {
    try {
      await updateDoc(
        doc(db, "videos", data.videoName),
        {
          dislikers: arrayUnion(currentUser.email),
          likers: arrayRemove(currentUser.email),
        }
      );
      updateDoc(doc(db, "videos", data.videoName), {
        dislikes: data.dislikers.length,
        likes: data.likers.length,
      });
    } catch (error) {
      toast.error("Please LogIn to dislike this video");
    }
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
  async function getdata(url) {
    onSnapshot(doc(db, "videos", url), (doc) => {
      if (setRealTimeData !== undefined) {
        setRealTimeData(doc.data());
      }
    });
    const docRef = doc(db, "videos", url);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      addView(
        docSnap.data().videoName + docSnap.data(),
        docSnap.data().views
      );
      document.title = docSnap.data().videoName + " - IceMemes";
      setData(docSnap.data());
      setLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // doc.data() will be undefined in this case
    }
  }
  useEffect(() => {
    let { name } = d;
    getdata(name);
    get();
  }, [location]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
          className="bg-gray-900 w-full h-screen flex justify-center	items-center"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : (
        <Sec
          title=""
          link=""
          content={
            <div className=" flex flex-col md:flex-row bg-gray-900 md:p-8 text-gray-100">
              <div className="w-full mb-8 md:w-2/3">
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
                      ></video>
                    </div>

                    <div className="p-2">
                      <div className="text-lg font-medium">
                        {data.videoName}
                      </div>
                      <div className="flex sm:justify-between flex-col sm:flex-row">
                        {" "}
                        <div>
                          <Link className="">
                            <span className="text-red-500">@</span>
                            {data.uploadedBy}
                          </Link>
                          <div className="">{realTimeData.views} views</div>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <IconContext.Provider
                            value={{
                              color: "white",
                              size: "40px",
                              className: "hover:bg-gray-800 p-2 rounded-lg m-1",
                            }}
                          >
                            <>
                              {realTimeData.likers.includes(
                                currentUser.email
                              ) ? (
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
                            </>
                          </IconContext.Provider>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </div>
                )}
              </div>
              <div className="w-full  md:w-1/3 md:p-4 md:p-12 md:pr-0 md:pt-0">
                {sidedata === undefined
                  ? ""
                  : sidedata.map((vid) => {
                      return (
                        <Link
                          to={
                            "/video/" + vid.videoName 
                          }
                          className="md:hover:bg-gray-800 p-2 flex flex-col w-full mb-4"
                          onClick={() => {
                            getdata(vid.videoName );
                          }}
                        >
                          <div
                            className="flex items-center justify-center bg-gray-900 h-48  md:h-full "
                            // style={{ width: "370px", height: "200px" }}
                          >
                            <img
                              alt=""
                              className="h-full w-full"
                              src={vid.thumbnail}
                            />
                          </div>

                          <div className="p-2">
                            <h6 className="text-lg font-medium">
                              {vid.videoName}
                            </h6>
                            <div className="">@{vid.uploadedBy}</div>
                            <div className="">views {vid.views} </div>
                          </div>
                        </Link>
                      );
                    })}
              </div>
            </div>
          }
        />
      )}
    </>
  );
}

export default Video;
