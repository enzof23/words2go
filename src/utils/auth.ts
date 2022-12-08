import { auth } from "../firebase/firebase-config";
import { useState, useEffect } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  AuthStatus,
  PromiseType,
  SignInEmail,
  SignUpEmail,
} from "../types/auth_types";

// auth observer

export function useFirebaseUser(): AuthStatus {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Create an observer for the authentication state
    const authObserver = auth.onAuthStateChanged(
      (user: User | null) => {
        // Set the user state to the user that was retrieved, or null if no user
        // was retrieved
        setUser(user);

        // Set the loading state to false since the fetch is complete
        setLoading(false);
      },
      (error: Error) => {
        // Set the error state to the error that occurred
        setError(error);
      }
    );

    // Return a cleanup function that will unregister the observer
    return () => authObserver();
  }, []);

  return { user, loading, error };
}

// firebase functions

export const signUpEmail: SignUpEmail = async ({
  email,
  password,
  username,
}) => {
  try {
    const userData = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user: User = userData.user;

    await updateProfile(user, {
      displayName: username,
    });
  } catch (err) {
    alert(`An error has occured: ${err}`);
  }
};

export const signInEmail: SignInEmail = async ({ email, password }) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert(`An error has occured: ${err}`);
  }
};

export const passwordForgotten = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert(`An email has been sent to your address ${email}`);
  } catch (error) {
    alert(`An error has occured: ${error}`);
  }
};

export const googleAuth: PromiseType = async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    alert(`An error has occured: ${err}`);
  }
};

export const userSignOut: PromiseType = async () => {
  try {
    signOut(auth);
  } catch (err) {
    alert(`An error has occured: ${err}`);
  }
};

export const verifyEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
