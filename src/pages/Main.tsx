import { User } from "firebase/auth";
import { Outlet } from "react-router-dom";

import { Navbar, Sidebar } from "../components";

import "../styles/_main.scss";

type HomeProps = {
  user: User;
};

const Home = ({ user }: HomeProps) => {
  const { photoURL, displayName } = user;

  return (
    <div className="main__container">
      <Navbar />
      <main>
        <Sidebar userName={displayName} userImg={photoURL} />
        <Outlet context={user} />
      </main>
    </div>
  );
};

export default Home;
