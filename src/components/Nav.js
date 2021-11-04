import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./css/nav.css";
import { useAuth } from "../contexts/Auth";
import Dropdown from "./Dropdown";
import pic from "./user.png";
import { useMediaQuery } from "react-responsive";
import { BsUpload } from "react-icons/bs";
const Nav = () => {
  const { currentUser, SignOut } = useAuth();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 750px)" });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 750px)",
  });

  const ProfileMenu = () => {
    return (
      <>
        <Link
          to="/profile"
          className="inline-block hover:bg-gray-700  align-middle px-16 py-2 font-medium text-left w-full  text-gray-100"
        >
          {currentUser.displayName === null ||
          currentUser.displayName === undefined
            ? "Profile"
            : currentUser.displayName}
        </Link>
        {isTabletOrMobile && <></>}
        {isDesktopOrLaptop && <></>}
        <hr />
        <button
          className=" hover:bg-gray-200  bg-gray-100   align-middle px-2 font-medium text-center  w-full h-8 text-red-600 font-extrabold"
          onClick={SignOut}
        >
          Log Out
        </button>
      </>
    );
  };
  return (
    <>
      <nav className="sticky top-0">
        <div id="navc">
          <div id="left">
            <div id="logo">
              <Link to="/">MemeCave</Link>
            </div>
            <div id="search">
              <form
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input type="text" placeholder="Search memes..." />
                <button>
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
                </button>
              </form>
            </div>
          </div>
          <div id="right">
            <ul>
              <li className="mobile">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 24 24"
                    height="16px"
                    viewBox="0 0 24 24"
                    width="16px"
                    fill="#e3bb37"
                  >
                    <g>
                      <rect fill="none" height="24" width="24" />
                    </g>
                    <g>
                      <g>
                        <g>
                          <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M16.2,16.2L11,13V7h1.5v5.2l4.5,2.7L16.2,16.2z" />
                        </g>
                      </g>
                    </g>
                  </svg>
                  LATEST
                </Link>
              </li>
              <li className="mobile">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16px"
                    viewBox="0 0 24 24"
                    width="16px"
                    fill="#e3bb37"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  </svg>
                  CATEGORY
                </Link>
              </li>
              <li className="mobile">
                <Link to="/upload">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16px"
                    viewBox="0 0 24 24"
                    width="16px"
                    fill="#e3bb37"
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  UPLOAD
                </Link>
              </li>
              {currentUser === "" ? (
                <>
                  <li>
                    <Link to="/login">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16px"
                        viewBox="0 0 24 24"
                        width="16px"
                        fill="#e3bb37"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2-2zM11 16l4-4-4-4v3H1v2h10v3z" />
                      </svg>
                      SIGN IN
                    </Link>
                  </li>
                  <li id="signup">
                    <Link to="/register">CREATE AN ACCOUNT</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Dropdown img={pic} content={<ProfileMenu />} />
                  </li>
                </>
              )}
            </ul>
          </div>

          <div id="mobile_right">
            <Dropdown
              img=""
                      
              other={ <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#fff"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>}
              content={
                <div id="m_search">
                  <form
                    action=""
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <input type="text" placeholder="Search memes..." />
                    <button>
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
                    </button>
                  </form>
                </div>
              }
            />

            <Dropdown img={pic} content={<ProfileMenu />} />
          </div>
        </div>
      </nav>

      {/* <header className="header sticky top-0 w-full">
        <nav className="navbar">
          <Link
            to="/"
            className="nav-logo hover:text-gray-100 text-base sm:text-lg"
          >
            IceMemes
          </Link>

          <div className="links">
            <Searchbox />

            <ul className={`nav-menu ${navtoggle}`}>
              <li>
                <NavLink
                  className="nav-item"
                  exact
                  to="/"
                  activeClassName="active"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-item"
                  exact
                  to="/upload"
                  activeClassName="active"
                >
                  <BsUpload className="mr-2" /> Upload
                </NavLink>
              </li>

              

              <div className="flex mx-auto">
                {currentUser === "" ? (
                  <Link
                    to="/login"
                    className="leading-4 px-4 py-2 m-2  text-sm font-medium border  transition text-blue-600 bg-transparent	 border-blue-600 hover:text-gray-100 hover:bg-blue-600 transform motion-reduce:transform-none"
                  >
                    Log In
                  </Link>
                ) : (
                  <>
                    <Dropdown profilePic={pic} content={<ProfileMenu />} />
                  </>
                )}
              </div>
            </ul>
          </div>
          
          {isTabletOrMobile &&
            (currentUser === "" ? (
              <>
                <Link
                  to="/login"
                  className="leading-4 px-4 py-2 m-2  text-sm font-medium border  transition text-green-600 bg-transparent	 border-green-600 hover:text-gray-100 hover:bg-green-600 transform motion-reduce:transform-none"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                {}
                <Dropdown
                  profilePic="https://firebasestorage.googleapis.com/v0/b/meme--temp.appspot.com/o/user.png?alt=media&token=f2277b5c-42bc-4d33-b658-0a084f1a1041"
                  content={<ProfileMenu />}
                />
              </>
            ))}
        </nav>
      </header> */}
    </>
  );
};

export default Nav;
