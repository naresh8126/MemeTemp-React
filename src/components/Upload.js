import { useState } from "react";
import "./css/upload.css";
import pic from "./pic.jpg";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";


function Upload() {
  const storage = getStorage();
  const [state, setstate] = useState(initialState)
  // Create the file metadata
  function uploadNow(e) {
    e.preventdefault()
    const metadata = {
      contentType: "image/jpg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "images/" + "pic.jpg");
    const uploadTask = uploadBytesResumable(storageRef, pic, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
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
          <form onSubmit={uploadNow} class="mt-8 space-y-3" method="POST">
            <div class="grid grid-cols-1 space-y-2">
              <label class="text-sm font-bold text-gray-500 tracking-wide">
                Title
              </label>
              <input
                class="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                type=""
                placeholder="enter your meme name"
                required
              />
            </div>
            <div class="grid grid-cols-1 space-y-2">
              <label class="text-sm font-bold text-gray-500 tracking-wide">
                Attach a video
              </label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div class="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-400 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg> */}
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
                  <input type="file" class="hidden" required />
                </label>
              </div>
            </div>
            <p class="text-sm text-gray-300">
              <span>File type: mp4</span>
            </p>
            <div>
              <button
                type="submit"
                class="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Upload;
