import { useState } from "react";

import {
  googleAuth,
  passwordForgotten,
  signInEmail,
  verifyEmail,
} from "../utils/auth";

import { FcGoogle } from "react-icons/fc";
import { circle } from "../assets/_index";
import { Collapse } from "@mui/material";
import { SignInForm, SignUpForm } from "../components/index";

import "../styles/_authentication.scss";

const Authentication = () => {
  const [signingIn, setSigningIn] = useState(true);

  const handlePasswordForgotten = () => {
    const emailAddress = prompt("Enter your email address", "");

    if (emailAddress) {
      const validEmail = verifyEmail(emailAddress);

      if (validEmail) {
        passwordForgotten(emailAddress);
      } else {
        alert("Please enter a valid email address");
      }
    }
  };

  return (
    <main className="authentication__container">
      {/* Authentication Header */}
      <section className="authentication__header">
        <h1 className="header__main">words2go</h1>
        <div className="header__sub">
          <h2>
            Organize and practice your <span>vocabulary studies</span> all in
            one place.
          </h2>
          <p>
            Get started by signing up or have a look at the{" "}
            <button
              type="button"
              className="text__button"
              onClick={() =>
                signInEmail({
                  email: "account@demo.com",
                  password: "1234567890",
                })
              }
            >
              demo
            </button>{" "}
            to play around with the application.
          </p>
        </div>
      </section>
      {/* Authentication Header End */}

      {/* Authentication Forms */}
      <section className="authentication__forms">
        {/* Sign In */}
        <Collapse in={signingIn}>
          <div className="signIn__formContainer form__container">
            <h2>
              sign <span>in</span>
            </h2>
            <SignInForm />
            <div className="signIn__subBtns">
              <button
                className="forgot__button text__button"
                type="button"
                onClick={handlePasswordForgotten}
              >
                forgot password ?
              </button>
              <div className="switch__logType">
                <p>
                  Don't have an account yet ?{" "}
                  <button
                    className="text__button"
                    type="button"
                    onClick={() => setSigningIn(false)}
                  >
                    Sign Up !
                  </button>
                </p>
              </div>
            </div>
            <button
              className="googleAuth__button flex__center"
              onClick={googleAuth}
            >
              <FcGoogle />
              Sign in with Google
            </button>
          </div>
        </Collapse>
        {/* Sign In End */}

        {/* Sign Up */}
        <Collapse in={!signingIn}>
          <div className="signUp__formContainer form__container">
            <h2>
              sign <span>up</span>
            </h2>
            <SignUpForm />
            <div className="switch__logType">
              <p>
                Already have an account ?{" "}
                <button
                  className="text__button"
                  type="button"
                  onClick={() => setSigningIn(true)}
                >
                  Sign In !
                </button>
              </p>
            </div>
            <button
              className="googleAuth__button flex__center"
              onClick={googleAuth}
            >
              <FcGoogle />
              Sign up with Google
            </button>
          </div>
        </Collapse>
        {/* Sign Up End */}
      </section>
      {/* Authentication Forms End */}

      {/* Background Circles */}
      <div className="circles__container">
        <img src={circle} alt="circle" />
        <img src={circle} alt="circle" />
        <img src={circle} alt="circle" />
      </div>
      {/* Background Circles End */}
    </main>
  );
};

export default Authentication;
