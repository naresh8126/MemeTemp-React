import React from "react";
import { Link } from "react-router-dom";
import {} from "react-router-dom"
import "./css/hero.css";
import ig from '../static/ig.png'
import tw from '../static/tw.png'
import fb from '../static/fb.png'
function Hero() {
  
  const [search, setsearch] = React.useState("");
  const changeSerch = (e) => {
    setsearch(e.target.value);
  };
  
  return (
    <div id="search_hero">
      <div id="s">
        <h1 className="text-5xl text-gray-100 my-8">Welcome to MemeCave!</h1>
        <form
        className="mt-4s"
          action=""
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input type="text" placeholder="Search memes..." value={search} onChange={changeSerch} />
          <Link id="sBtn" to={`/search?q=${search}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#fff"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </Link>
        </form>
        <div className="links flex mt-6">
          <a className="m-4" href="#"><img width="50px" src={fb} alt="facebook" /></a>
          <a className="m-4" href="#"><img width="50px" src={ig} alt="instagram" /></a>
          <a className="m-4" href="#"><img width="50px" src={tw} alt="twitter" /></a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
