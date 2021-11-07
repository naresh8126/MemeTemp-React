import React from "react";
import Sec from "./Sec";
import pic from "./user.png";
import bg from "./bg.jpg";
import { useAuth } from "../contexts/Auth";
import PulseLoader from "react-spinners/PulseLoader";
import {
  doc,
  updateDoc,
  getFirestore,
  getDocs,
  where,
  query,
  collection,
} from "firebase/firestore";
import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";

function ProfileEdit() {
  const { currentUser, userData } = useAuth();
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const [loading, setLoading] = React.useState(false)
  const rUser = auth.currentUser;
  const [ppState, setPp] = React.useState(rUser.photoURL || "");
  const [bgState, setBg] = React.useState(userData.banner || "");
  const [user, setUser] = React.useState({
    username: currentUser.displayName,
    
    ig: userData.ig,
    bio: userData.bio,
    pass:""
  });

  let name, value;
  const getdata = (event) => {
    name = event.target.name;
    value = event.target.value;
    setUser({ ...user, [name]: value });
  };
  const uProfilPic = async (e) => {
    const file = await e.target.files[0];
    const storageRef = ref(storage, "userPics/" + rUser.uid);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setPp(url);
        toast.success("Profile Pic Uploaded");
        console.log("uploaded " + url);
      });
    });
  };
  const uBanner = async (e) => {
    const file = await e.target.files[0];
    const storageRef = ref(storage, "banners/" + rUser.uid);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setBg(url);
        toast.success("Banner Uploaded");
        console.log("uploaded " + url);
      });
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true)
    
    
    console.log(user);
    try { 
      const userUpdate = doc(db, "users", currentUser.uid);
      await updateDoc(userUpdate, {
        displayName: user.username,
        ig: user.ig,
        bio: user.bio,
        photoURL: ppState,
        banner: bgState,
      });
      await updateEmail(currentUser, user.email);
      await updateProfile(currentUser, {
        displayName: user.username,
        photoURL: ppState,
        banner: bgState,
      });
      const data = await getDocs(
        query(
          collection(db, "videos"),
          where("uploader_uid", "==", currentUser.uid)
        )
      );
      setLoading(false)
      toast.success("Profile Updated");
      try {
        data.forEach((e) => {
          updateDoc(doc(db, "videos", e.data().videoName), {
            uploadedBy: user.username,
           
          }).then(() => {
            setLoading(false)
            toast.success("Profile Updated");
          });
        });
        
      } catch (error) {
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.code);
    }
  };
  return (
    <div>
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
      {loading?<div
          id="loader"
          className="bg-gray-900 w-full h-screen flex justify-center	items-center"
        >
          <PulseLoader color={"#b5b5b5"} loading={true} size={20} />
        </div>:<Sec
        title="Edit your profile"
        content={
          <div className="flex flex-col bg-gray-800 sm:w-3/5 text-gray-100 mx-auto">
            <label className="w-full h-44  bg-gray-400 flex justify-center items-center text-gray-900 z-0">
              <img
                src={bgState || bg}
                alt=""
                className="z-0 h-44 w-full object-cover"
              />
              <input
                className="hidden"
                name="banner"
                type="file"
                accept="image/*"
                onChange={uBanner}
              />
            </label>
            <form
              className="w-full flex flex-col relative p-4 sm:p-8 z-10"
              onSubmit={submit}
            >
              <label className="absolute w-28 h-28 rounded-full bg-gray-100 mb-8 flex justify-center items-center text-gray-900 -top-14 right-8">
                <img
                  src={ppState || pic}
                  alt=""
                  className="rounded-full h-full w-full object-cover"
                />
                <input
                  className="hidden"
                  name="profilPic"
                  type="file"
                  accept="image/*"
                  onChange={uProfilPic}
                />
              </label>
              <h1 className="font-bold text-3xl">Account</h1>
              <div className="opacity-40">
                *Fill only what you want to change otherwise leave blank
              </div>
              <label className="text-gray-300 pt-8" htmlFor="username">
                UserName
              </label>
              <input
                name="username"
                placeholder="New UserName"
                className="bg-gray-900 p-2 w-full my-2"
                type="text"
                maxLength="20"
                onChange={getdata}
                value={user.username}
              />
             
              <h1 className="font-bold text-3xl mt-8">Other Information</h1>
              <label className="text-gray-300 mt-8" htmlFor="ig">
                Instagram User ID
              </label>
              <input
                name="ig"
                placeholder="User id"
                className="bg-gray-900 p-2 w-full my-2"
                type="text"
                maxLength="20"
                onChange={getdata}
                value={user.ig}
              />
              <label className="text-gray-300" htmlFor="bio">
                Bio
              </label>
              <textarea
                name="bio"
                placeholder="Maximum 250 characters"
                className="bg-gray-900 p-2 w-full my-2"
                type="text"
                maxLength="250"
                onChange={getdata}
                value={user.bio}
              />
              <input
                className="bg-blue-600 p-4 my-8 hover:bg-blue-700"
                type="submit"
                value="Save Profile"
              />
            </form>
          </div>
        }
        link=""
      />}
      
    </div>
  );
}

export default ProfileEdit;
