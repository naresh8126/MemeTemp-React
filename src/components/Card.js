import React from "react";
import { Link } from "react-router-dom";

function Card(props) {
  return (
    <div>
      <Link
        to={"/video/" + props.name + props.email.slice(0, -4)}
        class=" each mb-10 sm:m-2 md:border md:border-gray-200 bg-gray-100 relative block duration-500  transition-all  md:hover:border-purple-800 "
      >
        <div
          className="flex items-center justify-center bg-gray-900"
          style={{ width: "100%", height: "200px" }}
        >
          <img class="h-full" src={props.thumbnail} alt="" />
        </div>
        <div class="badge absolute top-0 right-0 bg-indigo-500 m-1 text-gray-200 p-1 px-2 text-xs font-bold rounded">
          {props.duration}s
        </div>
        <div class="info-box text-xs flex p-1 font-semibold text-gray-500 bg-gray-300">
          <span class="mr-1 p-1 px-2 font-bold">{props.views} views</span>
          <span class="mr-1 p-1 px-2 font-bold border-l border-gray-400">
            {props.likes} Likes
          </span>
          <span class="mr-1 p-1 px-2 font-bold border-l border-gray-400">
            {props.dislikes} Dislikes
          </span>
        </div>
        <div class="desc p-4 text-gray-800">
          <Link
            to="/"
            class="title font-bold block cursor-pointer hover:underline"
          >
            {props.name}
          </Link>
          <Link
            to="/"
            class="badge bg-indigo-500 text-blue-100 rounded px-1 text-xs font-bold cursor-pointer"
          >
            @{props.uploaderName}
          </Link>
          <span class="description text-sm block py-2 border-gray-400 mb-2"></span>
        </div>
      </Link>
    </div>
  );
}

export default Card;
