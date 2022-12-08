import { User } from "firebase/auth";

export type AuthStatus = {
  user: User | null;
  loading: boolean;
  error: Error | null;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  username: string;
} & SignInCredentials;

export type SignInEmail = ({
  email,
  password,
}: SignInCredentials) => Promise<void>;

export type SignUpEmail = ({
  email,
  password,
  username,
}: SignUpCredentials) => Promise<void>;

export type PromiseType = () => Promise<void>;
