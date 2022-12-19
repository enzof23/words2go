import { useState } from "react";

import {
  googleAuth,
  passwordForgotten,
  signInEmail,
  verifyEmail,
} from "../utils/auth";

import { SignInForm, SignUpForm } from "../components/authentication/AuthForms";
import { FcGoogle } from "react-icons/fc";
import circle from "../assets/circle.svg";
import { Collapse } from "@mui/material";

import "../styles/_authentication.css";

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
    <div className="auth__wrapper">
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
            <div className="sign-in form__container">
              <h2>
                sign <span>in</span>
              </h2>
              <SignInForm />
              <div className="sign-in__buttons">
                <button
                  className="forgot-button"
                  type="button"
                  onClick={handlePasswordForgotten}
                >
                  forgot password ?
                </button>
                <div className="log-type">
                  <p>Don't have an account yet ? </p>
                  <button type="button" onClick={() => setSigningIn(false)}>
                    Sign Up !
                  </button>
                </div>
              </div>
              <div className="google-auth">
                <button onClick={googleAuth}>
                  <FcGoogle />
                  Sign in with Google
                </button>
              </div>
            </div>
          </Collapse>
          {/* Sign In End */}

          {/* Sign Up */}
          <Collapse in={!signingIn}>
            <div className="sign-up form__container">
              <h2>
                sign <span>up</span>
              </h2>
              <SignUpForm />
              <div className="log-type">
                <p>Already have an account ? </p>
                <button type="button" onClick={() => setSigningIn(true)}>
                  Sign In !
                </button>
              </div>
              <div className="google-auth">
                <button onClick={googleAuth}>
                  <FcGoogle />
                  Sign up with Google
                </button>
              </div>
            </div>
          </Collapse>
          {/* Sign Up End */}
        </section>
        {/* Authentication Forms End */}
      </main>
      {/* Background Circles */}
      <div className="circles__container">
        <img src={circle} alt="circle" />
        <img src={circle} alt="circle" />
        <img src={circle} alt="circle" />
      </div>
      {/* Background Circles End */}
    </div>
  );
};

export default Authentication;
