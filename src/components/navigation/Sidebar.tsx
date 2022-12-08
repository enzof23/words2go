import { Link, useLocation } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";

type SidebarProps = {
  userName: string | null;
  userImg: string | null;
};

const Sidebar = ({ userName, userImg }: SidebarProps) => {
  const { pathname } = useLocation();

  const nameDisplayed =
    userName === "Demo Account" ? null : userName?.split(" ", 1);

  return (
    <div className="sidebar__container">
      <div className="sidebar__header">
        {userImg ? (
          <img src={userImg} alt="user_image" />
        ) : (
          <div className="nouser__image">
            <RiAccountCircleFill />
          </div>
        )}

        <h3>{nameDisplayed ? nameDisplayed : "Welcome"}</h3>
      </div>
      <ul className="sidebar__menu">
        <li className={`menu__item ${pathname === "/" ? "active" : null}`}>
          <Link to={"/"}>Library</Link>
        </li>
        <li
          className={`menu__item ${pathname === "/practice" ? "active" : null}`}
        >
          <Link to={"/practice"}>Practice</Link>
        </li>
        <li
          className={`menu__item ${
            pathname === "/create-list" ? "active" : null
          }`}
        >
          <Link to={"/create-list"}>Create List</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
