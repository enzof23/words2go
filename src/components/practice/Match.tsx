import { useEffect, useState } from "react";
import { WordInfo, WordType } from "../../types/list_types";
import { createMatchCard } from "../../utils/practice";

const Match = ({ words }: { words: WordType[] }) => {
  const [shuffledWords, setShuffledWords] = useState<WordInfo[]>(
    createMatchCard(words)
  );

  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const cardClick = (e: any, item: WordInfo) => {
    const { wordID, isSelected } = item;
    const cardClicked = e.target;

    if (!isSelected) {
      const wordsSelected = shuffledWords.filter((i) => i.isSelected === true);
      const hasWordsSelected = wordsSelected.length > 0;

      if (hasWordsSelected) {
        const selectedWord = wordsSelected[0];
        const selectedWordID = selectedWord.wordID;

        if (selectedWordID === wordID) {
          toggleIsMatched([item, selectedWord]);
        } else {
          cardClicked.classList.add("is-incorrect");
          setTimeout(function () {
            cardClicked.classList.remove("is-incorrect");
          }, 300);

          toggleIsSelected(selectedWord);
        }
      } else {
        toggleIsSelected(item);
      }
    } else {
      toggleIsSelected(item);
    }
  };

  const toggleIsSelected = (item: WordInfo) => {
    const { wordID, type } = item;

    const newList = shuffledWords.map((word) => {
      if (word.wordID === wordID && word.type === type) {
        return { ...word, isSelected: !word.isSelected };
      }
      return word;
    });

    setShuffledWords(newList);
  };

  const toggleIsMatched = (words: WordInfo[]) => {
    words.forEach((word) => {
      const { wordID } = word;

      const newList = shuffledWords.map((word) => {
        if (wordID === word.wordID)
          return { ...word, isSelected: false, isMatched: !word.isMatched };
        return word;
      });

      setShuffledWords(newList);
    });
  };

  useEffect(() => {
    const allMatched =
      shuffledWords.filter((word) => word.isMatched === false).length === 0;

    if (allMatched) {
      setGameFinished(true);
    }
  }, [shuffledWords]);

  const playAgain = () => {
    setShuffledWords(createMatchCard(words));
    setGameFinished(false);
  };

  return (
    <div className="match__container">
      <div className={`message__container ${gameFinished && "game-finished"}`}>
        {!gameFinished && "Match each word to its translation"}
        {gameFinished && "congrats ! you matched 'em all !"}
      </div>

      {!gameFinished && (
        <div className="cards__container">
          {shuffledWords.map((item) => {
            const { wordID, word, type, isSelected, isMatched } = item;
            return (
              <button
                key={`${wordID} ${type}`}
                id={wordID}
                className={`match__card ${isSelected && "is-selected"}`}
                disabled={isMatched}
                onClick={(e) => cardClick(e, item)}
              >
                {word}
              </button>
            );
          })}
        </div>
      )}

      {gameFinished && (
        <button className="play-again__button" onClick={playAgain}>
          play again
        </button>
      )}
    </div>
  );
};

export default Match;
