import { useState } from "react";

import { AuthenticationInput } from "../../styles/mui-styled";
import { signInEmail } from "../../utils/auth";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e: any) => {
    e.preventDefault();

    if (password) {
      signInEmail({ email, password });
    } else {
      alert("An error has occured during sign in, try again");
    }
  };

  return (
    <form onSubmit={signIn} className="flex__center">
      <AuthenticationInput
        label="Email address"
        type="email"
        variant="filled"
        required
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <AuthenticationInput
        label="Password"
        type="password"
        variant="filled"
        required
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <button
        type="submit"
        className="form__button"
        disabled={!email || !password}
      >
        sign in
      </button>
    </form>
  );
};

export default SignInForm;
