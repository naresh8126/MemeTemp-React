import React from "react";
import { Link } from "react-router-dom";
import {
  getFirestore,
  updateDoc,
  doc
} from "firebase/firestore";
function Card(props) {
  const db = getFirestore()
  updateDoc(doc(db,"videos",props.video.videoName),{
    likes:props.video.likers.length,
    dislikes:props.video.dislikers.length
  })
  return (
    <div>
      <Link
        to={"/video/" + props.video.videoName}
        className="each mb-10 sm:m-2  text-gray-100 relative block duration-500  transition-all  "
        style={{background:"#282c37"}}
      >
        <div
          className="flex items-center justify-center bg-gray-900"
          style={{ width: "100%", height: "200px" }}
        >
          <img className="h-full w-full object-cover" src={props.video.thumbnail} alt="props.video.name" />
        </div>
        <div className="badge absolute top-0 right-0 bg-indigo-500 m-1 text-gray-200 p-1 px-2 text-xs font-bold rounded">
          {parseInt(props.video.duration)}s
        </div>
        <div className="info-box text-xs flex p-1 font-semibold text-gray-100" style={{background:"#222631"}}>
          <span className="mr-1 p-1 px-2 font-bold">{props.video.views} views</span>
          <span className="mr-1 p-1 px-2 font-bold border-l border-gray-400">
            {props.video.likers.length} Likes
          </span>
          <span className="mr-1 p-1 px-2 font-bold border-l border-gray-400">
            {props.video.dislikers.length} Dislikes
          </span>
        </div>
        <div className="desc p-4 text-gray-100">
          <Link
            to={`/video/${props.video.videoName}`}
            className="title font-bold block cursor-pointer hover:underline truncate"
            
          >
            {props.video.videoName}
          </Link>
          <Link
            to={`/user/${props.video.uploader_uid}`}
            className="badge bg-indigo-500 text-blue-100 rounded px-1 text-xs font-bold cursor-pointer"
          >
            @{props.video.uploadedBy}
          </Link>
          <span className="description text-sm block py-2 border-gray-400 mb-2"></span>
        </div>
      </Link>
    </div>
  );
}

export default Card;
