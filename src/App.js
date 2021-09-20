import "./App.css";
import Main from "./components/Main";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Upload from "./components/Upload";
import { AuthProvider } from "./contexts/Auth";

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
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/upload">
                <Upload />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/register">
                <Register />
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
