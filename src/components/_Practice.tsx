import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { MdNavigateNext } from "react-icons/md";

import { OutletLoader } from "../layouts/LoadingSpinners";
import { getListByID } from "../utils/firebase-api";

import "../styles/_practice.css";

type ParamsType = { listid: string; userid: string };
type CategoryType = "flashcards" | "write" | "match";
type CategorySelected = {
  category: CategoryType;
  component: JSX.Element;
};

const Flashcard = lazy(() => import("./practice/Flashcard"));
const Write = lazy(() => import("./practice/Write"));
const Match = lazy(() => import("./practice/Match"));

const Practice = () => {
  const { userid, listid } = useParams<keyof ParamsType>() as ParamsType;
  const navigate = useNavigate();

  const { data, error, isFetching, isSuccess } = useQuery({
    queryKey: ["fetchList"],
    queryFn: () => getListByID({ userID: userid, listID: listid }),
  });

  const [categorySelected, setCategorySelected] =
    useState<CategorySelected | null>(null);

  const selectCategory = (id: CategoryType) => {
    if (isSuccess)
      switch (id) {
        case "flashcards":
          setCategorySelected({
            category: id,
            component: (
              <Suspense fallback={<OutletLoader />}>
                <Flashcard words={data.words} />
              </Suspense>
            ),
          });
          break;
        case "write":
          setCategorySelected({
            category: id,
            component: (
              <Suspense fallback={<OutletLoader />}>
                <Write words={data.words} />
              </Suspense>
            ),
          });
          break;
        case "match":
          setCategorySelected({
            category: id,
            component: (
              <Suspense fallback={<OutletLoader />}>
                <Match words={data.words} />
              </Suspense>
            ),
          });
          break;
        default:
          setCategorySelected({
            category: "flashcards",
            component: (
              <Suspense fallback={<OutletLoader />}>
                <Flashcard words={data.words} />
              </Suspense>
            ),
          });
      }
  };

  useEffect(() => {
    if (isSuccess) {
      setCategorySelected({
        category: "flashcards",
        component: <Flashcard words={data.words} />,
      });
    }
  }, [data, isSuccess]);

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
            <div className="practice__title">
              <h2>{data.title}</h2>
              <button onClick={() => navigate(`/library/${userid}/${listid}`)}>
                View in Library <MdNavigateNext />
              </button>
            </div>
            <div className="practice__category">
              <div
                className={`category__item ${
                  categorySelected?.category === "flashcards"
                    ? "selected"
                    : null
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
                  categorySelected?.category === "write" ? "selected" : null
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
                  categorySelected?.category === "match" ? "selected" : null
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
          <div className="practice__container">
            {categorySelected ? categorySelected.component : <OutletLoader />}
          </div>
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

export default Practice;
