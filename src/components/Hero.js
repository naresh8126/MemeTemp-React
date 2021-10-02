import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [search, setsearch] = React.useState("");
  const changeSerch = (e) => {
    setsearch(e.target.value);
  };
  return (
    <div>
      <div className="container mx-auto bg-gray-700 p-6 sm:p-14 ">
        <h1 className="text-center font-bold text-white text-4xl">
          Free Meme templates
        </h1>
        <p className="mx-auto font-normal text-sm my-6 max-w-lg"></p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex items-center bg-white rounded-lg overflow-hidden px-2 py-1 justify-between lg:mx-80 mx-4"
        >
          <input
            className="text-base text-gray-400 flex-grow outline-none p-2 "
            type="text"
            placeholder="Search your meme"
            onChange={changeSerch}
            value={search}
            required
          />
          <div className="ms:flex items-center rounded-lg space-x-4 mx-auto ">
            <Link
              to={`/search?q=${search}`}
              className="rounded-md text-sm font-medium border-b-2 focus:outline-none transition text-white bg-blue-500 border-blue-800 hover:bg-blue-600 active:bg-blue-700  transform hover:scale-110 motion-reduce:transform-none px-4 py-2"
              type="submit"
            >
              Search
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Hero;
