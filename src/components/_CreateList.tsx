import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { User } from "firebase/auth";

import { createNewList } from "../utils/firebase-api";
import { WordType } from "../types/list_types";

import { HalfCircleSpinner } from "react-epic-spinners";

import NewWordForm from "./global/NewWordForm";
import WordRow from "./global/WordRow";

import "../styles/list-components.css";

const CreateList = () => {
  const user: User = useOutletContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [hasTitle, setHasTitle] = useState<boolean>(false);
  const [creatingList, setCreatingList] = useState<boolean>(false);

  const [list, setList] = useState<WordType[]>([]);
  const [listID, setListID] = useState<string | null>(null);

  const [focused, setFocused] = useState<boolean>(false);
  const triggerBorder = focused || title;

  const createList = async (e: any) => {
    e.preventDefault();

    if (title) {
      const userID = user.uid;
      setCreatingList(true);

      const id = await createNewList(userID, title);

      setListID(id);
      setCreatingList(false);
      setHasTitle(true);
    }
  };

  const createListDone = async () => {
    if (list.length > 0) {
      navigate(`/library/${user.uid}/${listID}`);
    }
  };

  return (
    <div className="outlet__wrapper">
      <div className="outlet__container">
        {!hasTitle && (
          <div className="outlet__title">
            <h2>create a new list</h2>
          </div>
        )}
        <div className="create-list__container">
          {/* New List Title Form */}
          {!hasTitle ? (
            <div className="title__container">
              <h5 className="title__header">Name your new list</h5>
              <form
                className={`title__form ${triggerBorder && "input__focused"}`}
                onSubmit={createList}
              >
                <input
                  placeholder="Enter a title..."
                  value={title}
                  maxLength={30}
                  autoFocus
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
                <button type="submit" disabled={!title}>
                  {creatingList ? (
                    <HalfCircleSpinner color="var(--yellow)" size={28} />
                  ) : (
                    "create"
                  )}
                </button>
              </form>
            </div>
          ) : null}
          {/* New List Title Form End */}

          {/* New Word Form */}
          {hasTitle ? (
            <div className="new-word__container">
              <h2 className="create-list__title">{title}</h2>
              <NewWordForm title={title} list={list} setList={setList} />
              {list.length > 0 && (
                <button
                  type="button"
                  className="save__button"
                  onClick={createListDone}
                >
                  done
                </button>
              )}
            </div>
          ) : null}
          {/* New Word Input End */}

          {/* List Display */}
          {list.length > 0 && listID ? (
            <div className="words-list__container">
              {list.map((word) => {
                return (
                  <WordRow
                    key={word.wordID}
                    listId={listID}
                    wordData={word}
                    setList={setList}
                  />
                );
              })}
            </div>
          ) : null}
          {/* List Display End */}
        </div>
      </div>
    </div>
  );
};

export default CreateList;
