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
import { ToastContainer, toast } from "react-toastify";

import { getStorage } from "firebase/storage";
import { BsDownload } from "react-icons/bs";
import DownloadLink from "react-download-link";
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
    try {
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
        likers: arrayUnion(currentUser.email),
        dislikers: arrayRemove(currentUser.email),
      });
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
        dislikes: data.dislikers.length,
        likes: data.likers.length,
      });
    } catch (error) {
      toast.error("Please LogIn to like this video");
    }
  }

  // dislike function====================================================================================
  function addDislike() {
    try {
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
        dislikers: arrayUnion(currentUser.email),
        likers: arrayRemove(currentUser.email),
      });
      updateDoc(doc(db, "videos", data.videoName + data.email.slice(0, -4)), {
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
    document.title = url + "IceMemes";
    onSnapshot(doc(db, "videos", url), (doc) => {
      if (setRealTimeData !== undefined) {
        setRealTimeData(doc.data());
      }
    });
    const docRef = doc(db, "videos", url);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
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
    }
  }
  useEffect(() => {
    let { name } = d;
    getdata(name);
    get();
  }, []);

  // download =================================================================================
  const download = (url) => {
    // setdownl(url)
    // document.getElementById("downl").click()
  };

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
          className="bg-gray-100 w-full h-screen flex justify-center	items-center"
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
                          <DownloadLink
                            filename={data.videoName + data.ext}
                            exportFile={() => data.url}
                          >
                            <BsDownload />
                          </DownloadLink>
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
                      className="md:hover:bg-gray-300 p-2 md:flex w-full h-48 mb-4"
                      onClick={() => {
                        getdata(vid.videoName + vid.email.slice(0, -4));
                      }}
                    >
                      <div
                        className="flex items-center justify-center bg-gray-900 h-48  md:h-full md:w-1/2"
                        // style={{ width: "370px", height: "200px" }}
                      >
                        <img alt="" className="h-full" src={vid.thumbnail} />
                      </div>

                      <div className="p-2 md:w-1/2">
                        <h6 className="text-lg font-medium">{vid.videoName}</h6>
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
