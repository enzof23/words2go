import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";

import { getAllLists } from "../../utils/firebase-api";
import { ListType } from "../../types/list_types";

import { ListCard } from "../index";
import { IoIosReturnLeft, IoIosAddCircleOutline } from "react-icons/io";
import { GridLoader } from "../../layouts/_index";

type OutletParams = {
  data: ListType[];
  navigate: NavigateFunction;
};

const MainOutlet = () => {
  const user: User = useOutletContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { isFetching, data, error } = useQuery({
    queryKey: ["allLists"],
    queryFn: () => getAllLists(user.uid),
  });

  const OutletTitle =
    pathname === "/" ? (
      <div className="outlet__title">
        <h2>my lists</h2>
        <p>Open a list to review or update it.</p>
      </div>
    ) : pathname === "/practice" ? (
      <div className="outlet__title">
        <h2>select a list to start the practice</h2>
        <p>Note: you need at least 5 words in your list to start a practice.</p>
      </div>
    ) : null;

  if (error instanceof Error) {
    return (
      <div className="outlet__wrapper">
        An error has occured, could not fetch lists - {error.message}
      </div>
    );
  }

  return (
    <div className="outlet__wrapper">
      <div className="outlet__container">
        {OutletTitle}
        {isFetching ? (
          <GridLoader />
        ) : data ? (
          pathname === "/" ? (
            <LibraryGrid data={data} navigate={navigate} />
          ) : pathname === "/practice" ? (
            <PracticeGrid data={data} navigate={navigate} />
          ) : null
        ) : (
          <div>No data found, please try again</div>
        )}
      </div>
    </div>
  );
};

export default MainOutlet;

const LibraryGrid = ({ data, navigate }: OutletParams) => {
  return (
    <div className="outlet__grid">
      {data.map((list) => (
        <ListCard key={list.listID} data={list} route={null} />
      ))}
      <div
        className="card__container action__card"
        onClick={() => navigate("/create-list")}
      >
        <p>Create a new list</p>
        <IoIosAddCircleOutline />
      </div>
    </div>
  );
};

const PracticeGrid = ({ data, navigate }: OutletParams) => {
  return (
    <div className="outlet__grid">
      {data.map((list) => {
        if (list.words.length > 4)
          return <ListCard key={list.listID} data={list} route={"practice"} />;
      })}
      {data.filter((list) => list.words.length > 4).length === 0 ? (
        <div
          className="card__container action__card"
          onClick={() => navigate("/")}
        >
          <p>Back to Library</p>
          <IoIosReturnLeft />
        </div>
      ) : null}
    </div>
  );
};
