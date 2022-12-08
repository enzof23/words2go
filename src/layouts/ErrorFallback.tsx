import { BiError } from "react-icons/bi";

const ErrorFallback = () => {
  return (
    <div
      className="fullpage__container"
      style={{
        color: "#c42f2f",
      }}
    >
      <div className="errormsg__container">
        <BiError />
        <h1>An error has occured</h1>
      </div>
    </div>
  );
};

export default ErrorFallback;
