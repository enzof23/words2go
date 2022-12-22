import { BiError } from "react-icons/bi";

import "../styles/layouts.css";

const ErrorFallback = () => {
  return (
    <div className="errormsg__container">
      <BiError />
      <h1>An error has occured</h1>
    </div>
  );
};

export default ErrorFallback;
