
import React, {useEffect, useState, createRef} from "react";
import PropTypes from 'prop-types'
import FormSignIn from "../components/FormSignIn";
import axios, {setToken} from "../utilities/axios";
import jwt_decode from "jwt-decode";

function GoogleSignIn ({isAuthenticated, setLoggedIn, setStage, stage, visibility}) {
    const myRef = createRef();
    async function profileExists (googleUser) {
        if (stage==="button")
            return {
                res:await axios.get("app/profile/?format=json"),
                googleUser: googleUser
            }
    }

    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        console.log("GoogleSignIn.jsx useEffect", window.google, isAuthenticated, initializing);

        if (window.google && !isAuthenticated && initializing) {
            window.google.accounts.id.initialize({
                auto_select: false,
                client_id: "239101865604-ur1qtro2fdnn75p31fhrumhqqvl5e445.apps.googleusercontent.com",
                callback: onSignIn,
                context: "signin",
                ux_mode: "popup",
            })
            window.google.accounts.id.prompt()
            window.google.accounts.id.renderButton(myRef.current, {
                text: "continue with Skype",
                theme: 'filled_black',
                shape: "pill",
                size: 'large',

            })
            setInitializing(false)
        }
    })


    const [googleUserState, setGoogleUserState] = useState(undefined);


    async function onSignIn(googleUser) {
        if (stage === "button") {

            let res_temp = await axios.post("app/oauthcallback/", {
                "jwt": googleUser.credential
            })
            setToken(res_temp.data['access_token'])

            if (!googleUserState)
                setGoogleUserState(jwt_decode(googleUser.credential));
            // setStage("form")


            // setLoggedIn()
            // await router.push("/")

        }
        if (!googleUserState)
            setGoogleUserState(jwt_decode(googleUser.credential));

        profileExists(googleUser).then((response) => {
            if (!response.res.data.length) {
                if (!googleUserState)
                    setGoogleUserState(jwt_decode(googleUser.credential));
                setStage("form");
            } else {
                setLoggedIn()
            }
        })
    }


    // let loggedIn=false;
    if (typeof window !== "undefined") {
        window.onSignIn = (googleUser) => {
            onSignIn(googleUser);
        };
        // loggedIn = Boolean(localStorage.getItem("encrypted_token"));
    }
    if (visibility) {

        if (stage==="button")
            return (
                <div
                    ref={myRef}
                />
                );
        else if (stage==="form") {
            const nameSplitter = googleUserState.name.lastIndexOf(" ");
            return (
                <FormSignIn
                    emailId={googleUserState.email}
                    firstName={googleUserState.name.substring(0, nameSplitter)}
                    lastName={googleUserState.name.substring(nameSplitter + 1)}
                    onSubmit={setLoggedIn}
                />
            )
        }

    }
    return null;

}

GoogleSignIn.propTypes={
    isAuthenticated: PropTypes.bool.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
    setStage: PropTypes.func.isRequired,
    stage: PropTypes.string.isRequired,
    visibility: PropTypes.bool.isRequired,
}
export default GoogleSignIn;
