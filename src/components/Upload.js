import { useState } from "react";
import "./css/upload.css";
import { useAuth } from "../contexts/Auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

function Upload() {
  const db = getFirestore();
  let thumbnailUrl = "";
  const [uploading, setuploading] = useState("");
  const [url, setUrl] = useState("");
  let thumU = "";
  const [file, setFile] = useState("");
  const [uploadEvent, setuploadEvent] = useState({
    currState: "",
    pause: "",
    resume: "",
    cancel: "",
  });
  const [uploadChange, setuploadChange] = useState("upload");
  const [fName, setfName] = useState("unNamed");
  const storage = getStorage();
  const { currentUser } = useAuth();

  let files = "";
  let contentType;
  let video = document.getElementById("video");
  let canvas = document.getElementById("canvas");
  let w, h, ratio, context;

  async function getThumbnail() {
    context = canvas.getContext("2d");
    ratio = video.videoWidth / video.videoHeight;
    w = video.videoWidth - 100;
    h = parseInt(w / ratio, 10);
    canvas.width = w;
    canvas.height = h;
    context.fillRect(0, 0, w, h);
    context.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      const storageRef = ref(
        storage,
        "thumbnails/" + fName + currentUser.email
      );

      uploadBytes(storageRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((thumbURL) => {
          thumbnailUrl = thumbURL;
        });
        console.log("Uploaded a blob or file!");
      });
    });
    return thumU;
  }

  async function handleInput(e) {
    files = await e.target.files[0];
    if (files.size > 22097152) {
      setuploadChange("File is too big!");
      document.getElementById("submit").disabled = true;
      e.value = "";
      setUrl("");
      setFile("");
    } else {
      setUrl(window.URL.createObjectURL(e.target.files[0]));
      setFile(files);
      document.getElementById("name").value = files.name.slice(0, -4);
      setfName(document.getElementById("name").value);
      document.getElementById("submit").disabled = false;
      contentType = files.type;
      console.log(files, url);
      setuploadChange("Perfect Upload!!");
    }
  }
  const getName = (e) => {
    setfName(e.target.value);
    console.log(e.target.value);
  };

  async function uploadNow(e) {
    e.preventDefault();
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
      console.log(file);
      const storageRef = ref(storage, "videos/" + fName + currentUser.email);
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
              console.log("paused");
            },
            resume: () => {
              uploadTask.resume();
              console.log("resume");
            },
            cancel: () => {
              uploadTask.cancel();

              setuploadEvent({
                currState: "",
                pause: "",
                resume: "",
                cancel: "",
              });
              console.log("Upload is canceled");
              setuploadChange("canceled Upload again?");
              setuploading("");
            },
          });
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + parseInt(progress) + "% done");
          setuploading("Uploading " + parseInt(progress) + "%");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              setuploadChange("paused");
              setuploading("paused " + parseInt(progress) + "%");
              break;
            case "canceled":
              break;
            case "running":
              console.log("Upload is running");
              setuploadChange("uploading");
              document.getElementById("submit").disabled = true;
              setuploading("uploading " + parseInt(progress) + "%");
              break;
            default:
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
            default:
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDoc(doc(db, "videos", fName + currentUser.email), {
              
              videoName: fName,
              url: downloadURL,
              uploadedBy: currentUser.displayName,
              email: currentUser.email,
              thumbnail: thumbnailUrl,
              duration: document.getElementById("video").duration,
              views:0,
              likes:0,
              dislikes:0
            });
            console.log(document.getElementById("video").duration);
            console.log("File available at", downloadURL);
            console.log("thumbnail available at", thumbnailUrl);
            setuploading("Done!!!");
            setuploadChange("choose diffrent video to upload");
            document.getElementById("submit").disabled = true;
            setuploadEvent({
              currState: "",
              pause: "",
              resume: "",
              cancel: "",
            });
          });
        }
      );
    } else {
      alert("add file or wait please");
    }
  }
  return (
    <>
      <div class="h-screen relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center">
        <div class="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div class="sm:max-w-lg w-full p-4 px-16 bg-white rounded-xl z-10">
          <div class="text-center">
            <h2 class="mt-2 text-3xl font-bold text-gray-900">Meme Upload!</h2>
            <p class="mt-2 text-sm text-gray-400">
              Upload your meme here in video format{" "}
            </p>
          </div>
          <form onSubmit={uploadNow} class="mt-8 space-y-3">
            <div class="grid grid-cols-1 space-y-2">
              <label class="text-sm font-bold text-gray-500 tracking-wide">
                Title
              </label>
              <input
                class="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                type=""
                id="name"
                placeholder="enter your meme name"
                onChange={getName}
                maxLength="25"
                required
              />
            </div>
            <div class="grid grid-cols-1 space-y-2">
              <label class="text-sm font-bold text-gray-500 tracking-wide">
                Attach a video
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-2 group text-center">
                  <div class="text-gray-400 h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    <div class="flex flex-auto rounded-lg mx-auto ">
                      {file === "" ? (
                        ""
                      ) : (
                        <video
                          controls
                          class="max-h-44 rounded-lg object-center"
                          src={url}
                          alt=""
                          id="video"
                        />
                      )}
                    </div>
                    {url === ""
                      ? ""
                      : `File size is ${(file.size / 1000 / 1000).toFixed(
                          2
                        )}MB`}
                    <p class="pointer-none text-gray-500 ">
                      {url === "" ? (
                        <span class="text-sm">Drag and drop files here</span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>

                  <input
                    onChange={handleInput}
                    type="file"
                    accept="video/*"
                    class="hidden"
                    maxLength=""
                    required
                  />
                </label>
              </div>
            </div>
            <p class="text-sm text-gray-800">
              <span>{uploading}</span>
            </p>
            <div>
              <button
                type="submit"
                id="submit"
                class="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300 disabled:opacity-50"
                disabled
              >
                {uploadChange}
              </button>
            </div>
          </form>
          <div className="flex">
            {uploadEvent.currState === "" ? (
              ""
            ) : uploadEvent.currState === "running" ? (
              <button
                class="my-2 flex justify-center bg-green-500 rounded-full text-gray-100 px-4 py-2 tracking-wide
                                      focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={uploadEvent.pause}
              >
                pause
              </button>
            ) : (
              <button
                class="my-2 flex justify-center bg-green-500 rounded-full text-gray-100 px-4 py-2 tracking-wide
                                      focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={uploadEvent.resume}
              >
                resume
              </button>
            )}
            {uploadEvent.currState === "" ? (
              ""
            ) : (
              <button
                class="m-2 flex justify-center bg-red-500 rounded-full text-gray-100 px-4 py-2 tracking-wide
                                      focus:outline-none focus:shadow-outline hover:bg-red-600 shadow-lg cursor-pointer transition ease-in duration-300"
                onClick={uploadEvent.cancel}
              >
                cancel
              </button>
            )}
          </div>
        </div>
      </div>
      <canvas class="hidden" id="canvas"></canvas>
    </>
  );
}

export default Upload;
