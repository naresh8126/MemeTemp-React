import React from "react";

function Searchbox() {
  return (
    <>
      <div className="relative text-gray-600 w-1/3">
        <input
          type="search"
          name="search"
          placeholder="Search"
          className="hidden sm:block bg-white h-8 px-5 pr-10 rounded-full text-sm focus:outline-none w-full "
        />
        <button
          type="submit"
          className="hidden sm:block absolute right-0 top-0 h-full rounded-full hover:bg-gray-300 ml-4 px-4 hover:text-gray-800 "
        >
          <svg
            className="h-4 w-4 fill-current"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            style={{ enableBackground: "new 0 0 56.966 56.966" }}
            width="512px"
            height="512px"
          >
            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
          </svg>
        </button>
      </div>

      <div>
        <div className="bg-transparent flex flex-col justify-center sm:py-0 sm:hidden">
          <div className="flex items-center justify-center p-2">
            <div className=" relative inline-block text-left dropdown">
              <button className="sm:block h-full rounded-full hover:bg-gray-300 p-2 text-gray-100 hover:text-gray-800 outline-none">
                <svg
                  className="h-4 w-4 fill-current"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 56.966 56.966"
                  width="512px"
                  height="512px"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
              </button>

              <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
                <div
                  className="p-2 absolute right-0 w-56 mt-6 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                  aria-labelledby="headlessui-menu-button-1"
                  id="headlessui-menu-items-117"
                  role="menu"
                >
                  <div className="relative text-gray-600">
                    <input
                      type="search"
                      name="search"
                      placeholder="Search"
                      className="  bg-white h-8 px-5 pr-10 rounded-full text-sm focus:outline-none w-full "
                    />
                    <button
                      type="submit"
                      className=" absolute right-0 top-0 h-full rounded-full hover:bg-gray-300 ml-4 px-4 hover:text-gray-800 "
                    >
                      <svg
                        className="h-4 w-4 fill-current"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 56.966 56.966"
                        style={{ enableBackground: "new 0 0 56.966 56.966" }}
                        width="512px"
                        height="512px"
                      >
                        <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Searchbox;
