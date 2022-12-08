import React, { useState } from "react";

import { signUpEmail } from "../../utils/auth";
import { SignUpCredentials } from "../../types/auth_types";

import { AuthenticationInput } from "../../styles/mui-styled";

type SignUpFormType = {
  confirm: string;
} & SignUpCredentials;

const SignUpForm = () => {
  const [userCredentials, setUserCredentials] = useState<SignUpFormType>({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const formOnChange = (e: any) => {
    setUserCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const signUp = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { username, password, confirm, email } = userCredentials;

    const validPassword = password.length > 7;
    const passwordConfirmed = password === confirm;

    const allCredentialsValid = username && validPassword && passwordConfirmed;

    if (allCredentialsValid) {
      signUpEmail({ email, password, username });
    } else if (!validPassword) {
      alert("Your password must be at least 8 characters long");
    } else if (!passwordConfirmed) {
      alert("Your password confirmation isn't matching");
    } else {
      alert("An error has occured");
    }
  };

  return (
    <form onSubmit={signUp} onChange={formOnChange}>
      <AuthenticationInput
        variant="filled"
        label="Username"
        name="username"
        type="text"
        required
      />
      <AuthenticationInput
        variant="filled"
        label="Email"
        name="email"
        type="email"
        required
      />
      <AuthenticationInput
        variant="filled"
        label="Password"
        name="password"
        type="password"
        required
      />
      <AuthenticationInput
        variant="filled"
        label="Confirm Password"
        name="confirm"
        type="password"
        required
      />
      <button
        type="submit"
        className="form__button"
        disabled={
          !userCredentials.username ||
          !userCredentials.email ||
          !userCredentials.password ||
          !userCredentials.confirm
        }
      >
        sign up
      </button>
    </form>
  );
};

export default SignUpForm;
