import { Link } from "react-router-dom";
import { userSignOut } from "../../utils/auth";

const Navbar: React.FC = () => {
  const signOut = () => {
    userSignOut();
  };

  return (
    <nav className="navbar__container">
      <Link className="navbar__logo" to={"/"}>
        Words2Go
      </Link>

      <button className="navbar__button" onClick={signOut}>
        sign out
      </button>
    </nav>
  );
};

export default Navbar;
