import { Suspense } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";

import { getAllLists } from "../utils/firebase-api";
import { GridLoader } from "../layouts/LoadingSpinners";
import { ListType } from "../types/list_types";

import { IoIosAddCircleOutline, IoIosReturnLeft } from "react-icons/io";

// MainOutlet Component is used for both Library and Practice Outlet
// even though they're on different routes as a way to avoid
// fetching the lists everytime user switches between the components

const OutletGridDisplay = () => {
  const user: User = useOutletContext();
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
            <Suspense fallback={<GridLoader />}>
              <LibraryGrid data={data} />
            </Suspense>
          ) : pathname === "/practice" ? (
            <Suspense fallback={<GridLoader />}>
              <PracticeGrid data={data} />
            </Suspense>
          ) : null
        ) : (
          <div>No data found, please try again</div>
        )}
      </div>
    </div>
  );
};

export default OutletGridDisplay;

// Sub Components Grids
// Essentially the same for Library and Practice but
// Practice only displays lists with 5+ words

const LibraryGrid = ({ data }: { data: ListType[] }) => {
  const navigate = useNavigate();

  return (
    <div className="outlet__grid">
      {data.map((list) => (
        <ListCard key={list.listID} data={list} route={"library"} />
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

const PracticeGrid = ({ data }: { data: ListType[] }) => {
  const navigate = useNavigate();

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

// ListCard Component

type ListCardProps = {
  data: ListType;
  route: string;
};

const ListCard = ({ data, route }: ListCardProps) => {
  const navigate = useNavigate();
  const user: User = useOutletContext();

  return (
    <div
      className="card__container list__card"
      onClick={
        () => navigate(`${route ? `/${route}` : ""}/${user.uid}/${data.listID}`)
        // <Library /> is rendered on this route, selected list fetch is done in <Library />
      }
    >
      <div className="list__info">
        <h5>{data.title}</h5>
        <p>
          {data.words.length} word{data.words.length === 1 ? null : "s"}
        </p>
      </div>
      <div className="open">{route === null ? "open" : "start"}</div>
    </div>
  );
};
