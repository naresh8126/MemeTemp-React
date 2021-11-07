import { useState } from "react";
import "./css/upload.css";
import { useAuth } from "../contexts/Auth";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  FieldValue,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
function Upload() {
  document.title = "Upload Memes - Meme Cave";
  const db = getFirestore();
  let thumbnailUrl = "";

  const [url, setUrl] = useState("");
  let thumU = "";
  const [file, setFile] = useState("");
  const [upProgress, setUpProgress] = useState(0);
  const [uploadEvent, setuploadEvent] = useState({
    currState: "",
    pause: "",
    resume: "",
    cancel: "",
  });
  const [uploadChange, setuploadChange] = useState("upload");
  const [fName, setfName] = useState("");
  const storage = getStorage();
  const { currentUser,userData } = useAuth();

  let files = "";
  let contentType;
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let w, h, ratio, context;

  // ========getting thumbnail from video tag=====================================================================

  async function getThumbnail() {
    context = canvas.getContext("2d");
    ratio = video.videoWidth / video.videoHeight;
    w = video.videoWidth - 100;
    h = parseInt(w / ratio, 10);
    canvas.width = w * 0.5;
    canvas.height = h * 0.5;
    context.fillRect(0, 0, w * 0.5, h * 0.5);
    context.drawImage(video, 0, 0, w * 0.5, h * 0.5);
    canvas.toBlob((blob) => {
      const storageRef = ref(storage, "thumbnails/" + fName);

      uploadBytes(storageRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((thumbURL) => {
          thumbnailUrl = thumbURL;
        });
      });
    });
    return thumU;
  }

  // =================== handle input file =========================================================================================
  function isVideo(file) {
    const ext = [
      "mp4",
      ".mkv",
      ".avi",
      ".mov",
      ".mpeg",
      ".ogm",
      ".vmv",
      "mpg",
      "webm",
      "m4v",
    ];
    return ext.some((el) => file.endsWith(el));
  }
  async function handleInput(e) {
    files = await e.target.files[0];
    if (
      !isVideo(
        files.name.slice(
          (Math.max(0, files.name.lastIndexOf(".")) || Infinity) + 1
        )
      )
    ) {
      toast.error(`The file should be a Video`);
    } else {
      if (files.size > 52428800) {
        setuploadChange("File is too big!");
        toast.error("Please select file less then 50MB");
        document.getElementById("submit").disabled = true;
        e.value = "";
        setUrl("");
        setFile("");
      } else {
        setUrl(window.URL.createObjectURL(e.target.files[0]));
        setFile(files);
        if (fName === "") {
          document.getElementById("name").value = files.name
            .slice(0, -4)
            .replace(/[^a-zA-Z ]/g, "");
          setfName(document.getElementById("name").value);
        }
        document.getElementById("submit").disabled = false;
        contentType = files.type;
        setuploadChange("Perfect Upload!!");
      }
    }
  }
  const getName = (event) => {
    setfName(event.target.value.replace(/[^\w\s]/gi, " "));
  };

  async function uploadNow(e) {
    e.preventDefault();
    if (currentUser !== "" || fName !== "") {
      const docRef = doc(db, "videos", fName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Meme is already uploaded with '" + fName + "' name!!");
        toast.error("Meme is already uploaded with '" + fName + "' name!!");
      } else {
        const Turl = await getThumbnail();
        const metadata = {
          contentType: contentType,
          customMetadata: {
            name: fName,
            uploadedBy: currentUser.displayName,
            email: currentUser.email,
            thumbnail: Turl,
          },
        };

        if (file !== "") {
          const storageRef = ref(
            storage,
            "videos/" +
              fName +
              "." +
              file.name.slice(
                (Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1
              )
          );
          const uploadTask = uploadBytesResumable(storageRef, file, metadata);
          setuploadEvent({
            currState: "",
            pause: "",
            resume: "",
            cancel: "",
          });

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              setuploadEvent({
                currState: snapshot.state,
                pause: () => {
                  uploadTask.pause();
                  toast.info("Upload Paused");
                },
                resume: () => {
                  uploadTask.resume();
                  toast.info("Upload resumed");
                },
                cancel: () => {
                  uploadTask.cancel();
                  toast.error("Upload canceled");

                  setuploadEvent({
                    currState: "",
                    pause: "",
                    resume: "",
                    cancel: "",
                  });

                  setuploadChange("canceled Upload again?");
                },
              });
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

              setUpProgress(parseInt(progress));
              switch (snapshot.state) {
                case "paused":
                  setuploadChange("paused");

                  break;
                case "canceled":
                  break;
                case "running":
                  setuploadChange("uploading");
                  document.getElementById("submit").disabled = true;

                  break;
                default:
              }
            },
            (error) => {
              toast.error(error.code);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setTimeout(() => {
                const userUpdate = doc(db, "users", currentUser.uid);
                 updateDoc(userUpdate, {
                    uploads:userData.uploads + 1
                  });
                  if (thumbnailUrl) {
                    setDoc(doc(db, "videos", fName), {
                      videoName: fName,
                      url: downloadURL,
                      uploadedBy: currentUser.displayName,
                      email: currentUser.email,
                      thumbnail: thumbnailUrl,
                      duration: document.getElementById("video").duration,
                      views: 0,
                      likes: 0,
                      dislikes: 0,
                      likers: [],
                      dislikers: [],
                      commenters: [],
                      ext:
                        "." +
                        file.name.slice(
                          (Math.max(0, file.name.lastIndexOf(".")) ||
                            Infinity) + 1
                        ),
                      timestamp: new Date(),
                      tags: document
                        .getElementById("tags")
                        .value.toUpperCase()
                        .split(",")
                        .concat(fName.toUpperCase().split(" ")),
                      title: fName.toUpperCase().split(" "),
                      uploader_uid: currentUser.uid,
                    });
                    document.getElementById("tags").value = "";

                    toast.success("Video uploaded successfully :)");
                    setuploadChange("choose diffrent video to upload");
                    document.getElementById("submit").disabled = true;
                    setuploadEvent({
                      currState: "",
                      pause: "",
                      resume: "",
                      cancel: "",
                    });
                    setFile("");
                    setUrl("");
                    document.getElementById("name").value = "";
                    setfName("");
                  }
                }, 1000);
              });
            }
          );
        } else {
          toast.error("Add file or wait please");
        }
      }
    } else {
      toast.error("Enter title or login please");
    }
  }

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
      <div className="h-screen relative min-h-screen flex justify-center bg-gray-800 text-gray-100 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative md:items-center">
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="sm:max-w-lg w-full p-4 md:p-4 md:px-16 bg-gray-900 md:rounded-xl z-10">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-gray-100">
              Meme Upload!
            </h2>
            <p className="mt-2 text-sm text-gray-200">
              Upload your meme here in video format{" "}
            </p>
          </div>
          <form onSubmit={uploadNow} className="mt-8 space-y-3">
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-200 tracking-wide">
                Title
              </label>
              <input
                className="font-semibold text-gray-700 placeholder-gray-500 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                type="text"
                id="name"
                placeholder="Enter Meme Title"
                onChange={getName}
                maxLength="60"
                value={fName}
                required
              />
            </div>

            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-200 tracking-wide">
                Attach a video
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-2 group text-center">
                  <div className="text-gray-200 h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    <div className="flex flex-auto rounded-lg mx-auto ">
                      {file === "" ? (
                        ""
                      ) : (
                        <video
                          controls
                          className="max-h-44 rounded-lg object-center"
                          src={url}
                          alt=""
                          id="video"
                        />
                      )}
                    </div>
                    {url === ""
                      ? ""
                      : `File size is ${(file.size / 1000 / 1000).toFixed(2)}MB
                        
                        `}
                    <p className="pointer-none text-gray-200 ">
                      {url === "" ? (
                        <span className="text-sm">
                          Click here to select MEME
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>

                  <input
                    onChange={handleInput}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    required
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 space-y-2">
                <label className="text-sm font-bold text-gray-200 tracking-wide">
                  Tags (e.g. Indian,hindi,GTA,game etc.)
                </label>
                <input
                  className="font-semibold text-gray-700 placeholder-gray-500 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  type="text"
                  id="tags"
                  placeholder="Enter tags Separated by comma (Optional)"
                />
              </div>
            </div>
            {url === "" ? (
              ""
            ) : (
              <div className="text-gray-400 w-full text-center">
                Play and Puase at a frame to Add thumbnail
              </div>
            )}

            {/* <p className="text-sm text-gray-800">
              <span>{uploading}</span>
            </p> */}
            {uploadEvent.currState === "" ? (
              ""
            ) : (
              <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                <div
                  style={{ width: upProgress + "%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                ></div>
              </div>
            )}

            <div>
              <button
                type="submit"
                id="submit"
                className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300 disabled:opacity-50"
                disabled
              >
                {uploadChange}
              </button>
            </div>
          </form>
          <div className="flex w-full justify-center">
            {uploadEvent.currState === "" ? (
              ""
            ) : uploadEvent.currState === "running" ? (
              <button
                className="my-2 flex justify-center bg-green-500 rounded-full text-gray-100 px-4 py-2 tracking-wide
                                      focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300 w-2/4"
                onClick={uploadEvent.pause}
              >
                pause
              </button>
            ) : (
              <button
                className="my-2 flex justify-center bg-green-500 rounded-full text-gray-100 px-4 py-2 tracking-wide
                                      focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300 w-2/4"
                onClick={uploadEvent.resume}
              >
                resume
              </button>
            )}
            {uploadEvent.currState === "" ? (
              ""
            ) : (
              <button
                className="m-2 flex justify-center bg-red-500 rounded-full text-gray-100 px-4 py-2 tracking-wide
                                      focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300 w-2/4"
                onClick={uploadEvent.cancel}
              >
                cancel
              </button>
            )}
          </div>
        </div>
      </div>
      <canvas className="hidden" id="canvas"></canvas>
    </>
  );
}

export default Upload;
