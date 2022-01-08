import React, {useState} from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../images/logo.png";
import GoogleSignIn from "./GoogleSignIn";

function NavBarItem({ title, classprops }) {
  return (
      <li className={`mx-4 cursor-pointer ${classprops}`}>
          {title}
      </li>)
}

function Navbar({isAuthenticated, setLoggedIn}) {
    const [googleState, setGoogleState] = useState("button");

    const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
      <nav className="w-full flex md:justify-center justify-between items-center p-4">
          <div className="md:flex-[0.5] flex-initial justify-center items-center">
              <img
                  alt="logo"
                  className="w-32 cursor-pointer"
                  src={logo}
              />
          </div>

          <ul className="text-white md:flex hidden list-none flex-row justify-between items-center flex-initial">
              {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
                  <NavBarItem
                      key={item + index}
                      title={item}
                  />
        ))}

              <li className="">
                  <GoogleSignIn
                      isAuthenticated={isAuthenticated}
                      setLoggedIn={setLoggedIn}
                      setStage={setGoogleState}
                      stage={googleState}
                      visibility
                  />
              </li>
          </ul>

          <div className="flex relative">
              {!toggleMenu && (
              <HiMenuAlt4
                  className="text-white md:hidden cursor-pointer"
                  fontSize={28}
                  onClick={() => setToggleMenu(true)}
              />
        )}

              {toggleMenu && (
              <AiOutlineClose
                  className="text-white md:hidden cursor-pointer"
                  fontSize={28}
                  onClick={() => setToggleMenu(false)}
              />
        )}

              {toggleMenu && (
              <ul
                  className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none
            flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in"
              >
                  <li className="text-xl w-full my-2">
                      <AiOutlineClose onClick={() => setToggleMenu(false)} />
                  </li>

                  {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => (<NavBarItem
                  classprops="my-2 text-lg"
                  key={item + index}
                  title={item}
                                />),
            )}
              </ul>
        )}
          </div>
      </nav>
  );
}

export default Navbar;
