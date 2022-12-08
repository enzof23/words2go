import { HalfCircleSpinner } from "react-epic-spinners";

const GridLoader = () => {
  return (
    <div className="outlet__grid">
      {[1, 2, 3].map((item) => {
        return (
          <div key={item} className="card__container action__card">
            <HalfCircleSpinner color="var(--base-yellow)" size={76} />
          </div>
        );
      })}
    </div>
  );
};

export default GridLoader;
