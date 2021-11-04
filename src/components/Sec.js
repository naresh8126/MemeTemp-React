import React from "react";
import {Link} from 'react-router-dom'
function Sec(props) {
  
  return (
    <>
      <div
        className="flex flex-col "
        style={{ margin: "20px auto", width: "1100px",marginBottom:"4rem" }}
      >
        <h1 className="text-gray-100 border-b-2 text-2xl border-yellow-400 p-2">{props.title}</h1>
        <div>{props.content}</div>
        <Link className="text-gray-100 underline text-sm text-right" to={props.link}>View More...</Link>
      </div>
    </>
  );
}

export default Sec;
