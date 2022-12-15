import { useState } from "react";
import { User } from "firebase/auth";
import { useOutletContext } from "react-router-dom";

import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { HalfCircleSpinner } from "react-epic-spinners";

import { deleteWordFromList, updateWord } from "../../utils/firebase-api";
import { WordType } from "../../types/list_types";

import "../../styles/list-components.css";

type WordsListProps = {
  listId: string;
  wordData: WordType;
  setList: React.Dispatch<React.SetStateAction<WordType[]>>;
};

const WordRow = ({ listId, wordData, setList }: WordsListProps) => {
  const user: User = useOutletContext();
  const { wordID, word, translation } = wordData;

  // displays spinner while deleting word in firebase
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // displays inputs instead of words when user clicks on "edit" button
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // displays spinner while updating word in firebase
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

  // focus state to add styles to input in focus
  const [wordFocus, setWordFocus] = useState<boolean>(false);
  const [transFocus, setTransFocused] = useState<boolean>(false);

  const [newWord, setNewWord] = useState<string>(word);
  const [newTranslation, setNewTranslation] = useState<string>(translation);

  const deleteWord = async () => {
    const userID = user.uid;
    setIsDeleting(true);

    await deleteWordFromList({ userID, listID: listId, wordID });

    setList((prevList) => prevList.filter((word) => word.wordID !== wordID));
    setIsDeleting(false);
  };

  const editWord = async () => {
    // only update if one of either word or translation has been modified
    if (newWord !== word || newTranslation !== translation) {
      setLoadingEdit(true);

      const userID = user.uid;
      const updatedWord = { word: newWord, translation: newTranslation };

      await updateWord({
        userID,
        listID: listId,
        wordID,
        newWord: updatedWord,
      });

      setList((prevList) => {
        return prevList.map((word) => {
          if (word.wordID !== wordID) return word;
          else return { wordID, ...updatedWord };
        });
      });

      setIsEditing(false);
      setLoadingEdit(false);
    }

    setIsEditing(false);
  };

  return (
    <div key={wordID} className="word-row__container">
      {isEditing ? (
        <>
          <div className="word__container">
            <div
              className={`edit__input ${wordFocus && "edit-input__focused"}`}
            >
              <input
                value={newWord}
                onFocus={() => setWordFocus(!wordFocus)}
                onBlur={() => setWordFocus(false)}
                onChange={(e) => setNewWord(e.currentTarget.value)}
                autoFocus
              />
            </div>
            <div
              className={`edit__input ${transFocus && "edit-input__focused"}`}
            >
              <input
                value={newTranslation}
                onFocus={() => setTransFocused(!transFocus)}
                onBlur={() => setTransFocused(false)}
                onChange={(e) => setNewTranslation(e.currentTarget.value)}
              />
            </div>
          </div>
          <button
            className="button__editing"
            onClick={editWord}
            disabled={!newWord || !newTranslation}
          >
            {loadingEdit ? (
              <HalfCircleSpinner color="var(--base-yellow)" size={28} />
            ) : (
              "done"
            )}
          </button>
        </>
      ) : (
        <>
          <div className="word__container">
            <div>{word}</div>
            <div>{translation}</div>
          </div>
          <div className="buttons__container">
            <button
              type="button"
              className="edit"
              title="Edit"
              onClick={() => setIsEditing(true)}
            >
              <AiOutlineEdit />
            </button>
            <button
              type="button"
              className="delete"
              title="Delete"
              onClick={deleteWord}
            >
              {isDeleting ? (
                <HalfCircleSpinner color="var(--base-yellow)" size={28} />
              ) : (
                <AiOutlineDelete />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WordRow;
