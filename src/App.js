import "./App.css";
import Main from "./components/Main";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import { AuthProvider } from "./contexts/Auth";
import Video from './components/Video'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import About from "./components/About";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <div class="container mx-auto">
            <Nav />
            <Switch>
              <Route  path="/upload">
                <Upload />
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
            </Switch>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
