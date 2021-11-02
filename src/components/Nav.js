import React, { useState, useEffect } from "react";
import Btn from "./Btn";
import { Link, NavLink } from "react-router-dom";
import "./css/nav.css";
import { useAuth } from "../contexts/Auth";
import Dropdown from "./Dropdown";
import pic from "./user.png";
import { useMediaQuery } from "react-responsive";
import { BsUpload } from "react-icons/bs";
import Searchbox from './Searchbox'
const Nav = () => {
  const { currentUser, SignOut } = useAuth();
  
  const [navtoggle, setnavtoggle] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 750px)" });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 750px)",
  });

  const toggleNav = () => {
    if (navtoggle === "") {
      setnavtoggle("active");
    } else {
      setnavtoggle("");
    }
  };

  const ProfileMenu = () => {
    return (
      <>
        <Link
          to="/profile"
          className="inline-block rounded-lg hover:bg-gray-200 bg-transparent align-middle px-2 font-medium text-left w-full h-8 text-black"
        >
          {currentUser.displayName === null || currentUser.displayName === undefined
            ? "Profile"
            : currentUser.displayName}
        </Link>
        {isTabletOrMobile && (
          <>
           
            <NavLink
              exact
              to="/upload"
              className="inline-block rounded-lg hover:bg-gray-200 bg-transparent align-middle px-2 font-medium text-left w-full h-8 text-black flex items-center	"
            >
              upload
              <BsUpload className="mx-2" />
            </NavLink>
         
          </>
        )}
        {isDesktopOrLaptop && <></>}
        <hr />
        <button
          className="rounded-lg border-t-2 border-fuchsia-600 hover:bg-gray-200  align-middle px-2 font-medium text-left w-full h-8 text-red-600"
          onClick={SignOut}
        >
          Log Out
        </button>
      </>
    );
  };
  return (
    <>
      <header className="header sticky top-0 w-full">
        <nav className="navbar">
          <Link to="/" className="nav-logo hover:text-gray-100 text-base sm:text-lg">
            IceMemes
          </Link>
          
          <div className="links">
          <Searchbox/>
         
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

              {/* <Navlinks
                name="Category"
                activeClassName="active"
                to="/category"
              /> */}

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
          {/* <div className={`hamburger ${navtoggle}`} onClick={toggleNav}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div> */}

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
                <Dropdown profilePic="https://firebasestorage.googleapis.com/v0/b/meme--temp.appspot.com/o/user.png?alt=media&token=f2277b5c-42bc-4d33-b658-0a084f1a1041" content={<ProfileMenu />} />
              </>
            ))}
        </nav>
      </header>
    </>
  );
};

const Navlinks = (props) => {
  return (
    <>
      <li>
        <NavLink exact to={props.to} activeClassName={props.activeClassName}>
          {props.name}
        </NavLink>
      </li>
    </>
  );
};

export default Nav;
