import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getListByID } from "../../utils/firebase-api";
import { OutletLoader } from "../../layouts/_index";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ImLoop } from "react-icons/im";

import { WordType } from "../../types/list_types";

import "../../styles/_practice.css";

type ParamsType = { listid: string; userid: string };
type CategoryType = "flashcards" | "write" | "match";
type CategorySelected = {
  category: CategoryType;
  comp: JSX.Element;
};
type CompParams = {
  words: WordType[];
};

const PracticeDisplay = () => {
  const { userid, listid } = useParams<keyof ParamsType>() as ParamsType;

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
            comp: <Flashcard words={data.words} />,
          });
          break;
        case "write":
          setCategorySelected({
            category: id,
            comp: <Write words={data.words} />,
          });
          break;
        case "match":
          setCategorySelected({
            category: id,
            comp: <Match words={data.words} />,
          });
          break;
        default:
          setCategorySelected({
            category: "flashcards",
            comp: <Flashcard words={data.words} />,
          });
      }
  };

  useEffect(() => {
    if (isSuccess) {
      setCategorySelected({
        category: "flashcards",
        comp: <Flashcard words={data.words} />,
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

  if (isSuccess && categorySelected) {
    return (
      <div className="outlet__wrapper">
        <div className="outlet__container">
          <div className="practice__header">
            <h2>{data.title}</h2>
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

const Flashcard = ({ words }: CompParams) => {
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);
  const [cardIndex, setCardIndex] = useState<number>(0);

  const checkNumber = (num: number) => {
    return num > words.length - 1 ? 0 : num < 0 ? words.length - 1 : num;
  };

  const countHandler = (e: any) => {
    const navId = e.currentTarget.id;
    let newIndex;

    switch (navId) {
      case "prev":
        newIndex = cardIndex - 1;
        setCardIndex(checkNumber(newIndex));
        break;
      case "next":
        newIndex = cardIndex + 1;
        setCardIndex(checkNumber(newIndex));
        break;
      default:
        return;
    }
  };

  return (
    <div className="flashcard__container">
      <div
        className={`flashcard__card ${cardFlipped && "is-flipped"}`}
        onClick={() => setCardFlipped(!cardFlipped)}
      >
        <div className="card__face card__front">
          <p className="card__content">{words[cardIndex].word}</p>
          <div className="loop-svg">
            <ImLoop />
          </div>
          <p className="card__info">word</p>
        </div>
        <div className="card__face card__back">
          <p className="card__content">{words[cardIndex].translation}</p>
          <div className="loop-svg">
            <ImLoop />
          </div>
          <p className="card__info">translation</p>
        </div>
      </div>
      <div className="flashcard__navigation">
        <div id="prev" className="navigation__button" onClick={countHandler}>
          <MdNavigateBefore />
        </div>
        <div className="navigation__counter">
          {`${cardIndex + 1} / ${words.length}`}
        </div>
        <div id="next" className="navigation__button" onClick={countHandler}>
          <MdNavigateNext />
        </div>
      </div>
    </div>
  );
};

const Write = ({ words }: CompParams) => {
  return <div>Write</div>;
};

const Match = ({ words }: CompParams) => {
  return <div>Match</div>;
};
