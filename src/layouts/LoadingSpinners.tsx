import { HalfCircleSpinner } from "react-epic-spinners";

import "../styles/layouts.css";
import "../styles/_main.css";

export const FullscreenLoader = () => {
  return (
    <div className="fullscreen__container">
      <div className="loader__container">
        <h1>words2go</h1>
        <HalfCircleSpinner color="var(--yellow)" size={76} />
      </div>
    </div>
  );
};

export const OutletLoader = () => {
  return (
    <div className="outlet__spinner">
      <HalfCircleSpinner color="var(--yellow)" size={76} />
    </div>
  );
};

export const GridLoader = () => {
  return (
    <div className="outlet__grid">
      {[1, 2, 3].map((item) => {
        return (
          <div key={item} className="card__spinner">
            <HalfCircleSpinner color="var(--yellow)" size={64} />
          </div>
        );
      })}
    </div>
  );
};
