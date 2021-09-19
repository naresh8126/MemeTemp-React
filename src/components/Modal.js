import React from "react";
function Modal(props) {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <>
      <button
        class={`leading-4 px-4 py-2 m-2  text-sm font-medium border  transition text-${props.color}-500 bg-transparent	 border-${props.color}-500 hover:text-gray-800 hover:bg-${props.color}-500 transform motion-reduce:transform-none`}
        type="button"
        onClick={() => setShowModal(true)}
      >
        {props.name}
      </button>
      {showModal ? (
        <>
           <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-2 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-lg font-semibold">
                   {props.title}
                  </h3>
                  <button
                    className="ml-auto bg-transparent border-0  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="leading-4 text-red-500 bg-transparent  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {props.content}
                </div>
          
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default Modal;
