import { useState, useRef } from "react";
import { User } from "firebase/auth";

import { HalfCircleSpinner } from "react-epic-spinners";
import { useOutletContext } from "react-router-dom";

import { addWordToList, getListID } from "../../../utils/firebase-api";
import { getRandomId } from "../../../utils/util";
import { WordType } from "../../../types/list_types";

import "../../../styles/list-components.css";

type Prop = {
  setList: React.Dispatch<React.SetStateAction<WordType[]>>;
  list: WordType[];
  title: string;
};

const NewWordForm = ({ title, list, setList }: Prop) => {
  const user: User = useOutletContext();
  const wordInputRef = useRef<HTMLInputElement>(null);

  const [wordFocus, setWordFocus] = useState<boolean>(false);
  const [transFocus, setTransFocused] = useState<boolean>(false);

  const [word, setWord] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const addWord = async (e: any) => {
    e.preventDefault();

    // displays spinner in place of "add button" while posting in firebase
    setIsAdding(true);

    const userID = user.uid;

    const wordID = getRandomId();
    const newWord = { word, translation };

    const listID = await getListID(userID, title);

    // add word to firebase
    await addWordToList({ userID, listID, wordID, newWord });

    // update list state to update UI
    const newList = [...list, { wordID, ...newWord }];
    setList(newList);

    // reset word form's state and inputs
    setIsAdding(false);
    setWord("");
    setTranslation("");
    wordInputRef.current?.focus();
  };

  return (
    <form className="new-word__form" onSubmit={addWord}>
      <div className="input__container">
        <div className={`word__input ${wordFocus && "input__focused"}`}>
          <input
            placeholder="Enter word..."
            value={word}
            ref={wordInputRef}
            autoFocus
            onFocus={() => setWordFocus(!wordFocus)}
            onBlur={() => setWordFocus(false)}
            onChange={(e) => setWord(e.currentTarget.value)}
          />
        </div>
        <p>word</p>
      </div>
      <div className="input__container">
        <div className={`word__input ${transFocus && "input__focused"}`}>
          <input
            placeholder="Enter translation..."
            value={translation}
            onFocus={() => setTransFocused(!transFocus)}
            onBlur={() => setTransFocused(false)}
            onChange={(e) => setTranslation(e.currentTarget.value)}
          />
        </div>
        <p>translation</p>
      </div>
      <button type="submit" disabled={!word || !translation}>
        {isAdding ? (
          <HalfCircleSpinner color="var(--base-yellow)" size={28} />
        ) : (
          "add"
        )}
      </button>
    </form>
  );
};

export default NewWordForm;
