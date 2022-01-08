
import React, {useState} from "react";
import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import {authSetLoggedIn} from "./utilities/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [loggedIn, _setLoggedIn] = useState((sessionStorage.getItem("loginFlag")));

    const setLoggedIn = () => {
        authSetLoggedIn();
        _setLoggedIn(true);
    }

    // const setLoggedOut = () => {
    //     authSetLoggedOut();
    //     _setLoggedIn(false);
    // }
  return (
      <div className="min-h-screen">
          <div className="gradient-bg-welcome">
              <Navbar
                  isAuthenticated={loggedIn}
                  setLoggedIn={setLoggedIn}
              />

              <Welcome />
          </div>

          <Services />

          <Transactions />

          <Footer />
      </div>)
}

export default App;
