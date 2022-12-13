import { User } from "firebase/auth";
import { Outlet } from "react-router-dom";

import { Navbar, Sidebar } from "../components";

import "../styles/_main.css";

type HomeProps = {
  user: User;
};

const Home = ({ user }: HomeProps) => {
  const { photoURL, displayName } = user;

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

export default Home;
