
import {createTheme, ThemeProvider} from "@mui/material";
import React, {useState} from "react";
import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import MarkedTransactionsReceived from "./components/MarkedTransactionsReceived";
import MarkedTransactionsSent from "./components/MarkedTransactionsSent";
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
        window.location.reload();
    }

    // const setLoggedOut = () => {
    //     authSetLoggedOut();
    //     _setLoggedIn(false);
    // }
  return (
      <ThemeProvider theme={MuiTheme}>
          <div className="min-h-screen gradient-bg-welcome">
              <div className="">
                  <Navbar
                      isAuthenticated={loggedIn}
                      setLoggedIn={setLoggedIn}
                  />

                  <Welcome
                      isAuthenticated={loggedIn}
                  />
              </div>

              {loggedIn && (
                  <div className="row gradient-bg-transactions">

                      <div className="col-12 col-md-6 my-3">
                          <MarkedTransactionsSent />
                      </div>

                      <div className="col-12 col-md-6 my-3">
                          <MarkedTransactionsReceived
                              isAuthenticated={loggedIn}
                          />
                      </div>


                  </div>)}

              {/*<Services />*/}

              {/*<Footer />*/}
          </div>
      </ThemeProvider>)
}

export default App;
