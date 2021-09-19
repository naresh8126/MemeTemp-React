import { useState } from "react";
import "./css/upload.css";
import { useAuth } from "../contexts/Auth";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function Upload() {
  const [uploading, setuploading] = useState();
  const [file, setFile] = useState({});
  const [uploadChange, setuploadChange] = useState("upload");
  const [fName, setfName] = useState("unNamed");
  const storage = getStorage();
  const { currentUser } = useAuth();

  let files;
  let fileName, contentType;

  async function handleInput(e) {
    files = await e.target.files[0];
    setFile(files)
    document.getElementById("name").value = files.name.slice(0, -4);
    contentType = files.type;
    console.log(files);
  }
  const getName = (e) => {
    setfName(e.target.value);

    console.log(fileName);
  };

  async function uploadNow(e) {
    e.preventDefault();
    const fileData = await files;
    console.log(fileData);
    const metadata = {
      contentType: contentType,
      customMetadata: {
        uploadedBy: currentUser.displayName,
        email: currentUser.email,
      },
    };
    const storageRef = ref(storage, "videos/" + fName);
    const uploadTask = uploadBytesResumable(storageRef, fileData, metadata);
    try {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + parseInt(progress) + "% done");
          setuploading("Uploading " + parseInt(progress) + "%");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              setuploadChange("resume");
              break;
            case "running":
              console.log("Upload is running");
              setuploadChange("pause");
              break;
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
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setuploading("Uploaded");
            setuploadChange("Upload Again?");
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div class="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center">
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
                required
              />
            </div>
            <div class="grid grid-cols-1 space-y-2">
              <label class="text-sm font-bold text-gray-500 tracking-wide">
                Attach a video
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div class="text-gray-400 h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    
                    {`File size is ${file.size/1000/1000}MB`}
                    <div class="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                      {/* <img class="has-mask h-36 object-center" src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg" alt="freepik image" /> */}
                    </div>
                    <p class="pointer-none text-gray-500 ">
                      <span class="text-sm">Drag and drop</span> files here{" "}
                      <br /> or{" "}
                      <a href="" id="" class="text-blue-600 hover:underline">
                        select a file
                      </a>{" "}
                      from your computer
                    </p>
                  </div>
                  <input
                    onChange={handleInput}
                    type="file"
                    accept="video/*"
                    class="hidden"
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
                class="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
              >
                {uploadChange}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Upload;
