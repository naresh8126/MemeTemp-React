import "./App.css";
import Main from "./components/Main";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import { AuthProvider } from "./contexts/Auth";
import Video from './components/Video'
import { BrowserRouter as Router, Switch, Route,Redirect } from "react-router-dom";
import React from "react";
import About from "./components/About";
import {
  getAuth,

} from "firebase/auth";
function App() {
  const auth = getAuth()
  console.log(auth.currentUser)
  return (
    <>
      <Router>
        <AuthProvider>
          <div class="">
            <Nav />
            <Switch>
              <Route  path="/upload">
              {auth.currentUser ? <Upload /> : <Redirect to="/login" />}
               
              </Route>
              <Route  path="/about">
                <About />
              </Route>
              <Route  path="/register">
                <Register />
              </Route>
              <Route  path="/login">
                <Login />
              </Route>
              <Route  path="/video/:name">
                <Video/>
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
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
