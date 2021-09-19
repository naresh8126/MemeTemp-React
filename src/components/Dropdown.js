import React from "react";


function Dropdown(props) {
  return (
    <>
      <div className="bg-transparent py-4 flex flex-col justify-center sm:py-0">
        <div className="flex items-center justify-center p-2">
          <div className=" relative inline-block text-left dropdown">
            
              <button
                className="leading-4 flex content-center rounded-full text-sm font-medium   transition text-blue-600 bg-transparent	hover:text-gray-800 hover:bg-blue-600 transform motion-reduce:transform-none"
                type="button"
                aria-haspopup="true"
                aria-expanded="true"
                aria-controls="headlessui-menu-items-117"
              >
                <img className="rounded-full w-8 h-8" src={props.profilePic} alt="" />
              </button>
            
            <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
              <div
                className="p-2 absolute right-0 w-56 mt-6 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
                aria-labelledby="headlessui-menu-button-1"
                id="headlessui-menu-items-117"
                role="menu"
              >
                {props.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dropdown;
