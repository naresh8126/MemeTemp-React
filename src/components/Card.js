import React from "react";

function Card(props) {
  return (
    <div>
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <div className=" border border-gray-100 transition border max-w-screen-md bg-white mt-6 pt-4 rounded-lg transform hover:scale-105 motion-reduce:transform-none hover:border-gray-300 hover:shadow-2xl">
          <div className="flex items-center	justify-between">
            <div className="flex items-center px-4">
              
              <div className="flex flex-col">
                <b className=" text-gray-800 text-lg">name{props.name}</b>
                <p className="text-gray-500 text-xs ">Uploaded by {props.uploaderName}</p>
                
              </div>
            </div>
            <div className="p-2 bg-gray-100 m-4	rounded-full h-3.5 flex	items-center justify-center">
            <time datetime="" className="text-gray-400 text-xs">
                  {props.uploadTime}
                </time>
            </div>
          </div>
          
          <div className="mt-2 flex gap-2	 justify-center border-b pb-4 flex-wrap	w-80 h-40">
            <img
              src={props.thumbnail}
              className="bg-gray-500  object-cover w-80 h-40 flex-auto"
              alt=""
            />
            
          </div>
          <div className=" h-16 border-b  flex items-center justify-around	">
            
            <div className="flex items-center	gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
              <div className="text-sm"></div>
            </div>
            <div className="flex items-center	gap-3">
              <svg
                width="22px"
                height="22px"
                viewBox="0 0 22 22"
                version="1.1"
                
              >
                <g
                  id="🎳-Social-Media"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    id="Square_Timeline"
                    transform="translate(-636.000000, -745.000000)"
                  >
                    <g
                      id="Post-1"
                      transform="translate(280.000000, 227.000000)"
                    >
                      <g
                        id="Post-Action"
                        transform="translate(0.000000, 495.000000)"
                      >
                        <g
                          transform="translate(30.000000, 21.000000)"
                          id="Share"
                        >
                          <g transform="translate(325.000000, 1.000000)">
                            <g id="ic_Share-Component/icon/ic_Share">
                              <g id="Share">
                                <circle
                                  id="Oval"
                                  cx="12"
                                  cy="12"
                                  r="12"
                                ></circle>
                                <g
                                  id="Group-24-Copy"
                                  transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) translate(1.000000, 1.000000)"
                                  fill="#92929D"
                                >
                                  <path
                                    d="M4,0 C6.209139,0 8,1.790861 8,4 C8,4.1291298 7.99388117,4.25683047 7.98191762,4.38282788 L15.371607,7.98470389 C16.0745405,7.37145444 16.9938914,7 18,7 C20.209139,7 22,8.790861 22,11 C22,13.209139 20.209139,15 18,15 C16.9572434,15 16.0076801,14.6009919 15.2956607,13.9473263 L7.98384745,17.6380767 C7.99453877,17.7572882 8,17.8780063 8,18 C8,20.209139 6.209139,22 4,22 C1.790861,22 0,20.209139 0,18 C0,15.790861 1.790861,14 4,14 C5.37147453,14 6.58173814,14.690226 7.30236849,15.7422555 L14.2017356,12.2577203 C14.0708451,11.8622268 14,11.4393868 14,11 C14,10.5276126 14.0818865,10.0743509 14.2322392,9.65363512 L7.29274641,6.27172794 C6.57099412,7.31588608 5.36538874,8 4,8 C1.790861,8 0,6.209139 0,4 C0,1.790861 1.790861,0 4,0 Z M4,16 C2.8954305,16 2,16.8954305 2,18 C2,19.1045695 2.8954305,20 4,20 C5.1045695,20 6,19.1045695 6,18 C6,16.8954305 5.1045695,16 4,16 Z M18,9 C16.8954305,9 16,9.8954305 16,11 C16,12.1045695 16.8954305,13 18,13 C19.1045695,13 20,12.1045695 20,11 C20,9.8954305 19.1045695,9 18,9 Z M4,2 C2.8954305,2 2,2.8954305 2,4 C2,5.1045695 2.8954305,6 4,6 C5.1045695,6 6,5.1045695 6,4 C6,2.8954305 5.1045695,2 4,2 Z"
                                    id="Combined-Shape"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <div className="text-sm"></div>
            </div>
            <img  className="opacity-50 flex items-center	gap-3 hover:bg-gray-200 rounded-lg p-2" src="https://img.icons8.com/material-sharp/24/000000/download--v1.png" />
              
      
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Card;
