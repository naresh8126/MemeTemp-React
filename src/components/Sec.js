import React from "react";
import { Link } from "react-router-dom";
function Sec(props) {
  
  return (
    
    <>
      <div
        className="flex flex-col items-center"
        style={{ margin: "0px auto", maxWidth: "calc(100% - 10px)", marginBottom: "8rem" ,width:"1100px"}}
      >
        {props.title!==""?  <h1 className="text-gray-100 border-b-2 text-2xl border-yellow-400 p-2 my-8 w-max">
          {props.title.toUpperCase()}
        </h1>:""}
      
        <div className="w-full">{props.content}</div>
        <h1 className="w-full text-right">
          {props.link !== "" ? (
            <Link className="text-gray-100 underline" to={props.link}>
              View More...
            </Link>
          ) : (
            ""
          )}
        </h1>
      </div>
    </>
  );
}

export default Sec;
