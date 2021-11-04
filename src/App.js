import "./App.css";
import Main from "./components/Main";
import Nav from "./components/Nav";

import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import { AuthProvider } from "./contexts/Auth";
import Video from "./components/Video";
import Profile from "./components/Profile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import React from "react";

import PrivateRoute from "./components/Private";
import SearchSection from './components/SearchSection'
import { getAuth } from "firebase/auth";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <div className="">
            <Nav />
            <Switch>
              <PrivateRoute component={Upload} path="/upload" exact />
              <PrivateRoute component={Profile} path="/profile" exact />
              
              <Route path="/register">
                {!isLoggedIn() ? <Register /> : <Redirect to="/" />}
              </Route>
              
              <Route path="/login">
                {!isLoggedIn() ? <Login /> : <Redirect to="/" />}
              </Route>
              <Route path="/video/:name">
                <Video />
              </Route>
              <Route exact path="/">
                <Main />
              </Route>
            
              
              <Route path="/search">
                <SearchSection />
              </Route>
            </Switch>
            
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}
function isLoggedIn() {
  const auth = getAuth();
  if (auth.currentUser) {
    return true;
  } else {
    return false;
  }
}

export default App;
