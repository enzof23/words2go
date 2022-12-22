import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { WordType } from "../types/list_types";
import {
  deleteList,
  getListByID,
  updateListTitle,
} from "../utils/firebase-api";

import { OutletLoader } from "../layouts/LoadingSpinners";
import { HalfCircleSpinner } from "react-epic-spinners";
import { BsThreeDotsVertical } from "react-icons/bs";

import WordRow from "./global/WordRow";
import NewWordForm from "./global/NewWordForm";

import "../styles/_library.css";
import "../styles/list-components.css";

type ParamsType = {
  listid: string;
  userid: string;
};

type ModalArgs = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Library = () => {
  const { userid, listid } = useParams<keyof ParamsType>() as ParamsType;
  const navigate = useNavigate();

  const { data, error, isFetching, isSuccess } = useQuery({
    queryKey: ["fetchList"],
    queryFn: () => getListByID({ userID: userid, listID: listid }),
  });

  const [list, setList] = useState<WordType[]>(isSuccess ? data.words : []);
  const [listTitle, setListTitle] = useState<string>("");

  // populate list state once data is fetched
  useEffect(() => {
    if (isSuccess) {
      setList(data.words);
      setListTitle(data.title);
    }
  }, [isSuccess, data]);

  // list menu function
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  //delete modal to make sure user did not misclick
  const [openModal, setOpenModal] = useState<boolean>(false);

  // add style to input
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  // state toggled to display title or input to update title
  const [renameList, setRenameList] = useState<boolean>(false);
  // shows loader in button while title is updated in firebase
  const [isRenamingList, setIsRenamingList] = useState<boolean>(false);

  // displays NewWordForm component when true
  const [addWord, setAddWord] = useState<boolean>(false);

  // Library menu click handler
  const menuAction = async (e: any) => {
    switch (e.target.id) {
      case "add-word":
        setAddWord(!addWord);
        break;
      case "rename-list":
        setRenameList(true);
        break;
      case "delete-list":
        setOpenModal(true);
        break;
      case "to-practice":
        navigate(`/practice/${userid}/${listid}`);
        break;
      default:
        setOpenMenu(false);
    }
    setOpenMenu(false);
  };

  const renameHandler = async () => {
    // only update if title has been updated
    if (listTitle !== data?.title) {
      setIsRenamingList(true);
      await updateListTitle({
        userID: userid,
        listID: listid,
        newTitle: listTitle,
      });
      setIsRenamingList(false);
    }

    setRenameList(false);
  };

  // close menu when user clicks outside menu
  useEffect(() => {
    const closeMenuOnClickAway = (event: any) => {
      if (!event.target.closest(".library__menu")) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("click", closeMenuOnClickAway);

    return () => {
      document.removeEventListener("click", closeMenuOnClickAway);
    };
  }, []);

  // return start
  if (isFetching) {
    return <OutletLoader />;
  }

  if (error instanceof Error) {
    return (
      <div className="outlet__wrapper">
        An error has occured, could not fetch lists. {error.message}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <>
        <div className="outlet__wrapper">
          <div className="outlet__container">
            {/* List Title Start */}
            {!renameList ? (
              // Normal list title display
              <div className="library__title">
                <h2>{listTitle}</h2>
                <div className="library__menu">
                  <button type="button" onClick={() => setOpenMenu(!openMenu)}>
                    <BsThreeDotsVertical />
                  </button>
                  <ul
                    className={`menu ${openMenu && "menu__open"}`}
                    id="list-menu"
                  >
                    <li id="add-word" onClick={menuAction}>
                      Add word
                    </li>
                    <li id="rename-list" onClick={menuAction}>
                      Rename list
                    </li>
                    <li id="delete-list" onClick={menuAction}>
                      Delete list
                    </li>
                    <li id="to-practice" onClick={menuAction}>
                      Go to Practice
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              // List title display while updating title
              <div className="library__title">
                <div
                  className={`rename__input ${inputFocus && "input__focused"}`}
                >
                  <input
                    ref={renameInputRef}
                    maxLength={30}
                    value={listTitle}
                    onChange={(e) => setListTitle(e.currentTarget.value)}
                    onFocus={() => setInputFocus(!inputFocus)}
                    onBlur={() => setInputFocus(false)}
                    autoFocus
                  />
                </div>
                <button
                  className="rename__button"
                  type="button"
                  onClick={renameHandler}
                  disabled={listTitle.length === 0}
                >
                  {isRenamingList ? (
                    <HalfCircleSpinner color="var(--base-yellow)" size={24} />
                  ) : (
                    "done"
                  )}
                </button>
              </div>
            )}
            {/* List Title End */}

            {/* Add New Word Start */}
            <div className={`library__new-word ${addWord && "is-adding"}`}>
              <NewWordForm title={listTitle} list={list} setList={setList} />
              <button
                className="save__button"
                onClick={() => setAddWord(false)}
              >
                done
              </button>
            </div>
            {/* Add New Word End */}

            {/* Words Table Start */}
            <div className="words-list__container">
              {/* If list has words, map through it and display row for each */}
              {list.map((word) => {
                return (
                  <WordRow
                    key={word.wordID}
                    listId={listid}
                    wordData={word}
                    setList={setList}
                  />
                );
              })}

              {/* If list is empty, display message and link to add new word */}
              {list.map((word) => word).length === 0 && !addWord ? (
                <div className="empty__list">
                  Your list is empty -{" "}
                  <span id="add-word" onClick={menuAction}>
                    start adding words{" "}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* Words Table End */}

        {/* Delete Modal */}
        {openModal && <DeleteModal setOpenModal={setOpenModal} />}
      </>
    );
  }

  return (
    <div className="outlet__wrapper">
      <div className="outlet__container">No data found, please try again</div>
    </div>
  );
};

export default Library;

// Modal displayed when user tries to delete list - just as a safe check before deleting list
const DeleteModal = ({ setOpenModal }: ModalArgs) => {
  const { userid, listid } = useParams<keyof ParamsType>() as ParamsType;
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const confirmDelete = async () => {
    setIsDeleting(true);

    await deleteList({ userID: userid, listID: listid });

    setIsDeleting(false);
    navigate("/");
  };

  return (
    <div className="modal__container">
      {isDeleting ? (
        <HalfCircleSpinner color="var(--base-yellow)" size={76} />
      ) : (
        <div className="modal__content">
          <p>Press confirm to delete the list</p>
          <div className="modal__buttons">
            <button type="button" className="confirm" onClick={confirmDelete}>
              confirm
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => setOpenModal(false)}
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
