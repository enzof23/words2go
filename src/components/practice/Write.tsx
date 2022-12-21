import { useEffect, useState } from "react";
import { WordType } from "../../types/list_types";
import { FiDelete } from "react-icons/fi";
import { createAnswerArr, getRandomWord } from "../../utils/practice";
import { Link } from "react-router-dom";

type Letter = {
  letter: string;
  selected: boolean;
  id: string;
};

const Write = ({ words }: { words: WordType[] }) => {
  /* States */

  // Copy of words array to keep track of words that have been tested already
  const [wordsList, setWordsList] = useState<WordType[]>(words);

  // Get a random word from wordsList to display for practice
  const [question, setQuestion] = useState<WordType>(getRandomWord(words));

  // Get the answer (translation) from question state
  const [answer, setAnswer] = useState<Letter[]>([]);

  // Track if user has gone through whole list
  const [listFinished, setListFinished] = useState<boolean>(false);

  // Don't know button handler
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  // Display the answer from letters selected
  const [answerDisplay, setAnswerDisplay] = useState<Letter[]>([]);
  const answerSelected = answerDisplay.map((letter) => letter.letter).join("");

  // Check Answer
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  /* States End */
  /*  */

  /* Functions */

  useEffect(() => {
    const answer = question.translation;
    const secondWord = getRandomWord(words).translation;
    const answerArr = createAnswerArr(answer, secondWord);

    setAnswer(answerArr);
  }, [question, wordsList]);

  // Letter buttons click handler
  const cardClickHandler = (item: Letter) => {
    setIsCorrect(null);

    // Map through answer (letters) array and update selected keys to disable button
    const newAnswer = answer.map((le) => {
      if (le.id === item.id) return { ...le, selected: true };
      else return le;
    });

    setAnswer(newAnswer);
    setAnswerDisplay((prev) => [...prev, item]);
  };

  // Delete icon handler to delete last char selected
  const deleteAnswer = () => {
    // toggle selected key back to false for delete char
    const lastIndex = answerDisplay.length - 1;
    const lastLetterID = answerDisplay[lastIndex].id;

    const newAnswer = answer.map((le) => {
      if (le.id === lastLetterID) return { ...le, selected: false };
      else return le;
    });

    setAnswer(newAnswer);

    const newAnswerDisplay = answerDisplay.slice(0, -1);
    setAnswerDisplay(newAnswerDisplay);

    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (answerSelected === question.translation) {
      setIsCorrect(true);

      setShowAnswer(true);
    } else {
      setIsCorrect(false);
    }
  };

  // Get next word - remove latest word from wordsList and update question
  const getNextWord = () => {
    const newWordsList = wordsList.filter(
      (word) => word.wordID !== question.wordID
    );

    if (newWordsList.length > 0) {
      setWordsList(newWordsList);

      setQuestion(getRandomWord(newWordsList));

      setShowAnswer(false);

      setAnswerDisplay([]);

      setIsCorrect(null);
    } else {
      setListFinished(true);
    }
  };

  // Start over after list is finished
  const startAgain = () => {
    setWordsList(words);

    setQuestion(getRandomWord(words));

    setListFinished(false);

    setShowAnswer(false);

    setAnswerDisplay([]);

    setIsCorrect(null);
  };

  /* Functions End */

  /*  */

  return (
    <>
      {!listFinished ? (
        <div className="write__container">
          {/* Question Container */}
          <div className="question__container">
            <div className="question__word">{question.word}</div>
            {!showAnswer ? (
              <div
                className="question__button"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                Don't know ?
              </div>
            ) : isCorrect ? (
              <p className="correct__msg">correct !</p>
            ) : null}
          </div>
          {/* Question Container End */}

          {/*  */}

          {/* Divider */}
          <div className="divider" />

          {/* Answer Container */}
          <div className="answer__container">
            {/* Answer Input */}
            {!showAnswer ? (
              <div
                className={`answer__display ${answerSelected && "has-answer"} ${
                  isCorrect === false && "incorrect"
                }`}
              >
                <div className="word__display">
                  {!answerSelected ? (
                    <p>Start typing your answer</p>
                  ) : (
                    answerSelected
                  )}
                </div>
                <button
                  className="delete__button"
                  onClick={deleteAnswer}
                  disabled={!answerSelected}
                >
                  <FiDelete />
                </button>
                <button
                  className={`answer__button ${isCorrect === false && "shake"}`}
                  disabled={!answerSelected}
                  onClick={checkAnswer}
                >
                  answer
                </button>
              </div>
            ) : (
              // Display answer and "next" btn when user clicks on "don't know ?" btn
              <div
                className={`answer__display has-answer ${
                  isCorrect === true ? "correct" : "incorrect"
                }`}
              >
                <div className="word__display">{question.translation}</div>
                <button className="answer__button" onClick={getNextWord}>
                  next
                </button>
              </div>
            )}

            {/* Answer Options */}
            <div className="answer__options">
              {answer.map((item) => {
                const { letter, selected, id } = item;
                return (
                  <button
                    key={id}
                    className="option__card"
                    disabled={selected || showAnswer}
                    onClick={() => cardClickHandler(item)}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Answer Container End */}
        </div>
      ) : (
        <div className="write__container">
          <div className="list-empty__message">
            You have reached the end of the list ! <br /> What's next ?
          </div>
          <div className="list-empty__buttons">
            <Link to={"/practice"}>Go back to Library</Link>
            <button onClick={startAgain}>Start again</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Write;
