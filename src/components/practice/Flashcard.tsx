import { useState } from "react";
import { WordType } from "../../types/list_types";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { ImLoop } from "react-icons/im";

type CompParams = {
  words: WordType[];
};

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

export default Flashcard;
