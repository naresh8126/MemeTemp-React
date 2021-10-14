import "./App.css";
import Main from "./components/Main";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
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
import About from "./components/About";
import PrivateRoute from "./components/Private";
import { getAuth } from "firebase/auth";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <div class="">
            <Nav />
            <Switch>
              <PrivateRoute component={Upload} path="/upload" exact />
              <PrivateRoute component={Profile} path="/profile" exact />
              <Route path="/about">
                <About />
              </Route>
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
            
              <Route>
                <Main />
              </Route>
              <Route path="search?q">
                <Main />
              </Route>
            </Switch>
            {/* <Footer /> */}
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
