import { HalfCircleSpinner } from "react-epic-spinners";
import "../styles/_layouts.scss";

const FullscreenLoader = () => {
  return (
    <div className="fullpage__container">
      <div className="loader__container">
        <h1>words2go</h1>
        <HalfCircleSpinner color="var(--base-yellow)" size={76} />
      </div>
    </div>
  );
};

export default FullscreenLoader;
