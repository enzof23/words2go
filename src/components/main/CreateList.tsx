import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { User } from "firebase/auth";

import { createNewList } from "../../utils/firebase-api";
import { WordType } from "../../types/list_types";

import { HalfCircleSpinner } from "react-epic-spinners";
import { NewWordForm, WordRow } from "../index";

import "../../styles/_createList.scss";

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
      navigate(`/${user.uid}/${listID}`);
    }
  };

  return (
    <div className="outlet__wrapper">
      <div className="outlet__container">
        <div className="outlet__title">
          <h2>create a new list</h2>
        </div>
        <div className="create-list__container">
          {/* List Title */}
          {!hasTitle ? (
            <div className="title__container">
              <h5 className="title__header">Name your new list.</h5>
              <form
                className={`title__form input__styled ${
                  triggerBorder && "input__focused"
                }`}
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
                    <HalfCircleSpinner color="var(--base-yellow)" size={32} />
                  ) : (
                    "create"
                  )}
                </button>
              </form>
            </div>
          ) : null}
          {/* List Title End */}

          {/* New Word Form */}
          {hasTitle ? (
            <div className="new-word__container">
              <h2 className="list__title">{title}</h2>
              <NewWordForm title={title} list={list} setList={setList} />
              <button
                type="button"
                className={`save__button ${list.length > 0 ? "save" : "empty"}`}
                onClick={createListDone}
              >
                done
              </button>
            </div>
          ) : null}
          {/* New Word Input End */}

          {/* List Display */}
          <div className="words-list__container">
            {listID &&
              list.map((word) => {
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
          {/* List Display End */}
        </div>
      </div>
    </div>
  );
};

export default CreateList;
