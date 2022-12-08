import { Link } from "react-router-dom";
import { userSignOut } from "../../utils/auth";

const Navbar: React.FC = () => {
  const signOut = () => {
    userSignOut();
  };

  return (
    <nav className="navbar__container">
      <h1 className="navbar__logo">
        <Link to={"/"}>Words2Go</Link>
      </h1>

      <button className="navbar__button" onClick={signOut}>
        sign out
      </button>
    </nav>
  );
};

export default Navbar;
