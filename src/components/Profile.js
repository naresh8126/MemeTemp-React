import PulseLoader from "react-spinners/PulseLoader";
import { ToastContainer, toast } from "react-toastify";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {
  collection,
  getDocs,
  getDoc,
  getFirestore,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/Auth";
import { useParams, Link, Routes, Route,useLocation } from "react-router-dom";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import ProfileInfo from "./ProfileInfo";
import pic from "./user.png";
import Sec from "./Sec";
const db = getFirestore();
const storage = getStorage();
const Profile = (props) => {
  const location = useLocation()
  const d = useParams();
  let { uid } = d;
  const { currentUser } = useAuth();
  const [user, setuser] = useState("");
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let { uid } = d;
    getDoc(doc(db, "users", uid)).then((u) => {
    setuser(u.data());
    document.title = u.data().displayName + " Profile - Meme Cave";
  });
    postsFirstBatch(user)
      .then((res) => {
        setPosts(res.posts);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user,location]);

  const postsFirstBatch = async (c) => {
    const u = c;
    try {
      const data = await getDocs(
        query(
          collection(db, "videos"),

          where("email", "==", u.email)
        )
      );
      let posts = [];

      data.forEach((doc) => {
        posts.push(doc.data());
      });

      return { posts };
    } catch (e) {}
  };

  const deleteData = async (video) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "videos", video.videoName));
      // Create a reference to the file to delete
      const desertRef = ref(storage, "videos/" + video.videoName + video.ext);

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          deleteObject(ref(storage, "thumbnails/" + video.videoName))
            .then(() => {
              setPosts([]);
              postsFirstBatch(user)
                .then((res) => {
                  setPosts(res.posts);
                  setLoading(false);

                  toast.success("Video Deleted!");
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const allPosts = (
    <>
      {posts.map((e) => {
        return (
          <div>
            <div className=" each mb-10 sm:m-2  bg-gray-800 relative block duration-500  transition-all   text-gray-100">
              <div
                className="flex items-center justify-center bg-gray-900"
                style={{ width: "100%", height: "200px" }}
              >
                <img
                  className="h-full w-full object-cover "
                  src={e.thumbnail}
                  alt={e.videoName}
                />
              </div>
              <div className="badge absolute top-0 right-0 bg-indigo-500 m-1 text-gray-200 p-1 px-2 text-xs font-bold rounded">
                {parseInt(e.duration)}s
              </div>
              {user.uid === currentUser.uid ? (
                <div className="absolute top-0 left-0">
                  <div className="badge  bg-red-500 m-1 text-gray-100 p-1 px-2 text-md font-bold rounded hover:bg-red-800">
                    <MdDeleteForever
                      onClick={() => {
                        deleteData(e);
                      }}
                    />
                  </div>
                  <div className="badge  bg-green-500 m-1 text-gray-100 p-1 px-2 text-md font-bold rounded hover:bg-green-800">
                    <MdEdit
                      onClick={() => {
                        alert("hello");
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="info-box text-xs flex p-1 font-semibold text-gray-200 bg-gray-800">
                <span className="mr-1 p-1 px-2 font-bold">{e.views} views</span>
                <span className="mr-1 p-1 px-2 font-bold border-l border-gray-400">
                  {e.likes} Likes
                </span>
                <span className="mr-1 p-1 px-2 font-bold border-l border-gray-400">
                  {e.dislikes} Dislikes
                </span>
              </div>
              <div className="desc p-4 text-gray-100">
                <Link
                  to={"/video/" + e.videoName}
                  className="title font-bold block cursor-pointer hover:underline truncate"
                >
                  {e.videoName}
                </Link>
                <span className="description text-sm block py-2 border-gray-400 mb-2"></span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
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
          className="bg-gray-900 w-full h-screen flex justify-center items-center m-0"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : (
        <>
          <Routes>
            <Route
              path="profile"
              element={
                <Sec
                  link=""
                  title=""
                  content={
                    <>
                      <ProfileInfo user={user} />
                      <Sec
                        link=""
                        title={
                          currentUser.uid === user.uid
                            ? "My Uploads"
                            : "Uploaded by " + user.displayName
                        }
                        content={
                          <div className="grid grid-cols-1 2xl:grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 sm:p-8 bg-transparent">
                            {allPosts}
                          </div>
                        }
                      />
                    </>
                  }
                />
              }
            />
            <Route path="followers" element={<Followers user={user} />} />
            <Route path="following" element={<Following user={user} />} />
          </Routes>
        </>
      )}
    </>
  );
};

function Followers(props) {
  const [Follower, setFollower] = useState([]);
  try {
    getDocs(
      query(
        collection(db, "users"),
        where("following", "array-contains", props.user.uid)
      )
    ).then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push(doc.data());
      });
      setFollower(posts);
    });
  } catch (error) {}
  return (
    <>
      {Follower.length === 0 ? (
        <div
          id="loader"
          className="bg-gray-900 w-full h-screen flex justify-center items-center m-0"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : (
        <Sec
          title={"Followers of " + props.user.displayName}
          link=""
          content={
            <ul className="text-gray-100">
              {Follower.map((e) => {
                return (
                  <>
                    <li className="w-full h-16 flex items-center p-4 bg-gray-800 justify-between text-lg">
                      <Link
                        to={`/user/${e.uid}/profile`}
                        className="flex items-center "
                      >
                        <img
                          className="mr-2 rounded-full"
                          width="50px"
                          height="50px"
                          src={e.photoURL || pic}
                          alt="photoURL"
                        />
                        <div className="flex flex-col text-sm">
                          <div>{e.displayName}</div>
                          <div className="opacity-50">
                            Followers {e.followers.length}
                          </div>
                        </div>
                      </Link>
                    </li>
                  </>
                );
              })}
            </ul>
          }
        />
      )}
    </>
  );
}
function Following(props) {
  const [Follower, setFollower] = useState([]);
  try {
    getDocs(
      query(
        collection(db, "users"),
        where("followers", "array-contains", props.user.uid)
      )
    ).then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push(doc.data());
      });
      setFollower(posts);
    });
  } catch (error) {}
  return (
    <>
      {Follower.length === 0 ? (
        <div
          id="loader"
          className="bg-gray-900 w-full h-screen flex justify-center items-center m-0"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>
      ) : (
        <Sec
          title={props.user.displayName + "Followings"}
          link=""
          content={
            <ul className="text-gray-100">
              {Follower.map((e) => {
                return (
                  <>
                    <li className="w-full h-16 flex items-center p-4 bg-gray-800 justify-between text-lg">
                      <Link
                        to={`/user/${e.uid}/profile`}
                        className="flex items-center "
                      >
                        <img
                          className="mr-2 rounded-full"
                          width="50px"
                          height="50px"
                          src={e.photoURL || pic}
                          alt="photoURL"
                        />
                        <div className="flex flex-col text-sm">
                          <div>{e.displayName}</div>
                          <div className="opacity-50">
                            Followers {e.followers.length}
                          </div>
                        </div>
                      </Link>
                    </li>
                  </>
                );
              })}
            </ul>
          }
        />
      )}
    </>
  );
}

export default Profile;
