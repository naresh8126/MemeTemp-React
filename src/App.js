import "./App.css";
import Main from "./components/Main";
import Nav from "./components/Nav";
import All from "./components/All";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import { useAuth } from "./contexts/Auth";
import Video from "./components/Video";
import ProfileEdit from "./components/ProfileEdit";
import Profile from "./components/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import SearchSection from "./components/SearchSection";

function App() {
  function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser !== "" ? children : <Navigate to="/login" />;
  }
  function PublicRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser === "" ? children : <Navigate to="/" />;
  }
  return (
    <>
      <div className="">
        <Nav />
        {/* <PrivateRoute component={Upload} path="/upload" exact />
          <PrivateRoute component={Profile} path="/profile" exact /> */}

        <Routes>
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <ProfileEdit />
              </PrivateRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="video/:name" element={<Video />} />
          <Route path="/" element={<Main />} />

          <Route
            path="/search"
            element={<SearchSection key={window.location.pathname} />}
          />

          <Route path="/memes/:type" element={<All />} />
        </Routes>
      </div>
    </>
  );
}


export default App;
