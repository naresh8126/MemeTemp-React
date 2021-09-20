import React, { useState, useEffect } from "react";
import Btn from "./Btn";
import { Link, NavLink } from "react-router-dom";
import "./css/nav.css";
import { useAuth } from "../contexts/Auth";
import Dropdown from "./Dropdown";
import pic from "./user.png";

const Nav = () => {
  const { currentUser, SignOut } = useAuth();
  const [navtoggle, setnavtoggle] = useState("");
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
        <button className="rounded-lg hover:bg-gray-200 align-middle px-2 font-medium text-left w-full h-8">
          {currentUser === null || currentUser === undefined ? "Profile" : currentUser.displayName}
        </button>
        <hr />
        <button
          className="rounded-lg border-t-2 border-fuchsia-600 hover:bg-gray-200 align-middle px-2 font-medium text-left w-full h-8"
          onClick={SignOut}
        >
          log out
        </button>
      </>
    );
  };
  return (
    <>
      <header className="header">
        <nav className="navbar">
          <Link to="/" className="nav-logo">
            MemeTemp
          </Link>
          <div className="links">
            <ul className={`nav-menu ${navtoggle}`}>
              <Navlinks name="Home" activeClassName="active" to="/" />
              <Navlinks name="About" activeClassName="active" to="/about" />
              <Navlinks name="Upload" activeClassName="active" to="/upload" />
              <Navlinks
                name="Category"
                activeClassName="active"
                to="/category"
              />

              <div class="flex mx-auto">
                {currentUser === "" ? (
                  <>
                    <Btn color="green" name="Login" to="/login" />
                    <Btn color="blue" name="Register" to="/register" />
                  </>
                ) : (
                  <>
                    {}
                    <Dropdown profilePic={pic} content={<ProfileMenu />} />
                  </>
                )}
              </div>
            </ul>
          </div>
          <div className={`hamburger ${navtoggle}`} onClick={toggleNav}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </nav>
      </header>
    </>
  );
};

const Navlinks = (props) => {
  return (
    <>
      <li className="nav-item">
        <NavLink exact to={props.to} className="nav-link">
          {props.name}
        </NavLink>
      </li>
    </>
  );
};

export default Nav;
