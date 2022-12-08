import { HalfCircleSpinner } from "react-epic-spinners";

const OutletLoader = () => {
  return (
    <div className="outlet__wrapper outlet__spinner">
      <HalfCircleSpinner color="var(--base-yellow)" size={76} />
    </div>
  );
};

export default OutletLoader;
