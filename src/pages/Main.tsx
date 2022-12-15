import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { User } from "firebase/auth";

import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";

import "../styles/_main.css";

type ParamsType = { userid: string };

const Main = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const { userid } = useParams<keyof ParamsType>() as ParamsType;
  const { photoURL, displayName } = user;

  useEffect(() => {
    if (userid && user && userid !== user.uid) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="main__wrapper">
      <Navbar />
      <main className="main__container">
        <Sidebar userName={displayName} userImg={photoURL} />
        <Outlet context={user} />
      </main>
    </div>
  );
};

export default Main;
