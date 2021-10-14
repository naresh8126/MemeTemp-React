import React from "react";
import { Link } from "react-router-dom";

function Btn(props) {
  return (
    <>
      <Link
        to={props.to}
        class={`leading-4 px-4 py-2 m-2  text-sm font-medium border  transition text-${props.color}-600 bg-transparent	 border-${props.color}-600 hover:text-gray-100 hover:bg-${props.color}-600 transform motion-reduce:transform-none`}
      >
        {props.name}
      </Link>
    </>
  );
}

export default Btn;
