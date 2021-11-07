import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  query,
  limit,
} from "firebase/firestore";
import pic from "./user.png";
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
  const { currentUser, userDate } = useAuth();
  const db = getFirestore();
  const d = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [realTimeData, setRealTimeData] = useState("");
  const [sidedata, setSideData] = useState([]);
  const [uploader, setuploader] = useState("");
  const [available, setavailable] = useState(true)
  useEffect(() => {
    let { name } = d;
    console.log(name);
    onSnapshot(doc(db, "videos", name), (doc) => {
      setRealTimeData(doc.data());
    });
  }, [d, db]);

  // views--------------------------------------------------------------------------------------
  async function addView(video, cviews) {
    await updateDoc(doc(db, "videos", video), {
      views: cviews + 1,
    });
  }
  useEffect(() => {
    try {
      updateDoc(doc(db, "videos", realTimeData.videoName), {
        dislikes: realTimeData.dislikers.length,
        likes: realTimeData.likers.length,
      }); 
    } catch (error) {
     
    }
    
    
  }, [realTimeData]);

  // follow function ======================================================================================
  function unFollow() {
    try {
      updateDoc(doc(db, "users", data.uploader_uid), {
        followers: arrayRemove(currentUser.uid),
      });
      updateDoc(doc(db, "users", currentUser.uid), {
        following: arrayRemove(currentUser.uid),
      });
      toast.success("You Unfollowed " + uploader.displayName);
    } catch (error) {
      toast.error("Please login to unfollow");
    }
  }
  // unfollow function ======================================================================================
  function follow() {
    try {
      updateDoc(doc(db, "users", data.uploader_uid), {
        followers: arrayUnion(currentUser.uid),
      });
      updateDoc(doc(db, "users", currentUser.uid), {
        following: arrayUnion(currentUser.uid),
      });
      toast.success("You Followed " + uploader.displayName);
    } catch (error) {
      toast.error("Please login to follow");
    }
  }
  // like function ======================================================================================
  function addLike() {
    try {
      updateDoc(doc(db, "videos", data.videoName), {
        likers: arrayUnion(currentUser.uid),
        dislikers: arrayRemove(currentUser.uid),
      });
    } catch (error) {
      toast.error("Please login to like this video");
    }
  }

  // dislike function====================================================================================
  function addDislike() {
    try {
      updateDoc(doc(db, "videos", data.videoName), {
        dislikers: arrayUnion(currentUser.uid),
        likers: arrayRemove(currentUser.uid),
      });
    } catch (error) {
      toast.error("Please login to dislike this video");
    }
  }

  // getting side videos data==============================================================================
  const get = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "videos"), limit(8))
    );
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
      addView(docSnap.data().videoName, docSnap.data().views);
      document.title = docSnap.data().videoName + " - Meme Cave";
      onSnapshot(doc(db, "users", docSnap.data().uploader_uid), (doc) => {
        setuploader(doc.data());
      });
      setData(docSnap.data());
      setLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      toast.error("Can't find video")
      setavailable(false)
    }
  }
  useEffect(() => {
    let { name } = d;
    getdata(name);
    get();
    console.log(data);
  }, []);

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
      {available?<>
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
                        className="h-60 w-full md:h-full object-cover"
                        autoPlay
                        controls
                        src={data.url}
                      ></video>
                    </div>

                    <div className="p-2">
                      <div className="text-lg font-medium">
                        {data.videoName}
                      </div>
                      <div className="flex sm:justify-between sm:flex-row text-gray-400">
                        {" "}
                        <div>
                          <div className="">
                            {realTimeData.views} views -{" "}
                            {data.timestamp.toDate().toDateString()}
                          </div>
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
                              {realTimeData.likers.includes(currentUser.uid) ? (
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
                                currentUser.uid
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
                    {uploader === "" ? (
                      ""
                    ) : (
                      <div className="w-full h-16 flex items-center p-4 bg-gray-800 justify-between text-lg">
                        <Link
                          to={`/user/${data.uploader_uid}`}
                          className="flex items-center "
                        >
                          <img
                            className="mr-2 rounded-full"
                            width="50px"
                            height="50px"
                            src={uploader.photoURL || pic}
                            alt="photoURL"
                          />
                          <div className="flex flex-col text-sm">
                            <div>{uploader.displayName}</div>
                            <div className="opacity-50">Followers {uploader.followers.length}</div>
                          </div>
                        </Link>
                        {uploader.followers.includes(currentUser.uid) ? (
                          <button
                            className="bg-gray-500 hover:bg-gray-700  p-2 px-4"
                            onClick={() => {
                              unFollow();
                            }}
                          >
                            unFollow
                          </button>
                        ) : (
                          <button
                            className="bg-blue-500 hover:bg-blue-600  p-2 px-4"
                            onClick={() => {
                              follow();
                            }}
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-full  md:w-1/3 md:p-4 md:p-12 md:pr-0 md:pt-0">
                {sidedata === undefined
                  ? ""
                  : sidedata.map((vid) => {
                      return (
                        <Link
                          to={"/video/" + vid.videoName}
                          className="md:hover:bg-gray-800 p-2 flex flex-col w-full mb-4"
                          onClick={() => {
                            getdata(vid.videoName);
                          }}
                        >
                          <div
                            className="flex items-center justify-center bg-gray-900 h-48  md:h-full "
                            // style={{ width: "370px", height: "200px" }}
                          >
                            <img
                              alt=""
                              className="h-48 w-full object-cover"
                              src={vid.thumbnail}
                            />
                          </div>

                          <div className="p-2">
                            <h6 className="text-lg font-medium truncate">
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
      )}</>
      :""}
    </>
  );
}

export default Video;
