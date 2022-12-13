import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getListByID } from "../../utils/firebase-api";
import { OutletLoader } from "../../layouts/_index";

import "../../styles/_practice.css";

type ParamsType = { listid: string; userid: string };
type CategoryType = "flashcards" | "write" | "match";
type CategorySelected = {
  category: CategoryType;
  comp: JSX.Element;
};

const PracticeDisplay = () => {
  const { userid, listid } = useParams<keyof ParamsType>() as ParamsType;

  const { data, error, isFetching, isSuccess } = useQuery({
    queryKey: ["fetchList"],
    queryFn: () => getListByID({ userID: userid, listID: listid }),
  });

  const [categorySelected, setCategorySelected] = useState<CategorySelected>({
    category: "flashcards",
    comp: <Flashcard />,
  });

  const selectCategory = (id: CategoryType) => {
    switch (id) {
      case "flashcards":
        setCategorySelected({
          category: id,
          comp: <Flashcard />,
        });
        break;
      case "write":
        setCategorySelected({
          category: id,
          comp: <Write />,
        });
        break;
      case "match":
        setCategorySelected({
          category: id,
          comp: <Match />,
        });
        break;
      default:
        setCategorySelected({
          category: "flashcards",
          comp: <Flashcard />,
        });
    }
  };

  // returns start

  if (isFetching) {
    return <OutletLoader />;
  }

  if (error instanceof Error) {
    return (
      <div className="outlet__container">
        An error has occured, could not fetch lists. {error.message}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="outlet__wrapper">
        <div className="outlet__container">
          <div className="practice__header">
            <h2>{data?.title}</h2>
            <div className="practice__category">
              <div
                className={`category__item ${
                  categorySelected.category === "flashcards" ? "selected" : null
                }`}
                id="flashcards"
                onClick={(e) =>
                  selectCategory(e.currentTarget.id as CategoryType)
                }
              >
                flashcards
              </div>
              <div
                className={`category__item ${
                  categorySelected.category === "write" ? "selected" : null
                }`}
                id="write"
                onClick={(e) =>
                  selectCategory(e.currentTarget.id as CategoryType)
                }
              >
                write
              </div>
              <div
                className={`category__item ${
                  categorySelected.category === "match" ? "selected" : null
                }`}
                id="match"
                onClick={(e) =>
                  selectCategory(e.currentTarget.id as CategoryType)
                }
              >
                match
              </div>
            </div>
          </div>
          <div className="practice__container">{categorySelected.comp}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="outlet__wrapper">
      <div className="outlet__container">No data found, please try again</div>
    </div>
  );
};

export default PracticeDisplay;

const Flashcard = () => {
  return <div>Flashcard</div>;
};
const Write = () => {
  return <div>Write</div>;
};
const Match = () => {
  return <div>Match</div>;
};
