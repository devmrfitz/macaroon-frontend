
import {createTheme, ThemeProvider} from "@mui/material";
import React, {useState} from "react";
import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import {authSetLoggedIn} from "./utilities/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

const MuiTheme = createTheme({
    palette: {
        mode: 'dark',
    }
});
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
      <ThemeProvider theme={MuiTheme}>
          <div className="min-h-screen">
              <div className="gradient-bg-welcome">
                  <Navbar
                      isAuthenticated={loggedIn}
                      setLoggedIn={setLoggedIn}
                  />

                  <Welcome
                      isAuthenticated={loggedIn}
                  />
              </div>

              <Services />

              <Transactions />

              <Footer />
          </div>
      </ThemeProvider>)
}

export default App;
