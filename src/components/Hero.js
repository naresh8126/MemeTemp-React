import React from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";

function Hero() {
  return (
   
      <div>
        <div className="container mx-auto bg-gray-700  p-14 hidden sm:block">
          <h1 className="text-center font-bold text-white text-4xl">
            Free Meme templates
          </h1>
          <p className="mx-auto font-normal text-sm my-6 max-w-lg"></p>
          <div className=" sm:flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between lg:mx-80 mx-4">
            <input
              className="text-base text-gray-400 flex-grow outline-none p-2 "
              type="text"
              placeholder="Search your meme"
            />
            <div className="ms:flex items-center  rounded-lg space-x-4 mx-auto ">
              <Link
                to="search"
                className="rounded-md text-sm font-medium border-b-2 focus:outline-none transition text-white bg-blue-500 border-blue-800 hover:bg-blue-600 active:bg-blue-700  transform hover:scale-110 motion-reduce:transform-none px-4 py-2"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    
  );
}

export default Hero;
