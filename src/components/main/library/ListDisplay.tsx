import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  deleteList,
  getListByID,
  updateListTitle,
} from "../../../utils/firebase-api";
import { WordType } from "../../../types/list_types";

import { BsThreeDotsVertical } from "react-icons/bs";
import { OutletLoader } from "../../../layouts/_index";
import WordRow from "../ui/WordRow";
import "../../../styles/_listStyle.scss";
import { HalfCircleSpinner } from "react-epic-spinners";
import NewWordForm from "../ui/NewWordForm";

type ParamsType = {
  listid: string;
  userid: string;
};

type ModalArgs = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const ListDisplay = () => {
  const { userid, listid } = useParams<keyof ParamsType>() as ParamsType;

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
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [renameList, setRenameList] = useState<boolean>(false);
  const [isRenamingList, setIsRenamingList] = useState<boolean>(false);

  const [addWord, setAddWord] = useState<boolean>(false);

  const menuAction = async (e: any) => {
    switch (e.target.id) {
      case "add-word":
        setAddWord(true);
        break;
      case "rename-list":
        setRenameList(true);
        break;
      case "delete-list":
        setOpenModal(true);
        break;
      default:
        setOpenMenu(!openMenu);
    }
    setOpenMenu(!openMenu);
  };

  const renameHandler = async () => {
    setIsRenamingList(true);
    await updateListTitle({
      userID: userid,
      listID: listid,
      newTitle: listTitle,
    });
    setIsRenamingList(false);
    setRenameList(false);
  };

  const addWordHandler = async () => {
    setAddWord(false);
  };

  // close menu when user clicks outside menu
  useEffect(() => {
    const closeMenuOnClickAway = (event: any) => {
      if (!event.target.closest(".list-display__menu")) {
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
              <div className="list-display__title">
                <h2>{listTitle}</h2>
                <div className="list-display__menu">
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
                  </ul>
                </div>
              </div>
            ) : (
              // List title display while updating title
              <div className="list-display__title">
                <input
                  className="rename__input"
                  maxLength={30}
                  value={listTitle}
                  onChange={(e) => setListTitle(e.currentTarget.value)}
                  autoFocus
                />
                <button
                  className="rename__button"
                  type="button"
                  onClick={renameHandler}
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
            <div className={`list-display__new-word ${addWord && "is-adding"}`}>
              <NewWordForm title={listTitle} list={list} setList={setList} />
              <button className="save__button" onClick={addWordHandler}>
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
export default ListDisplay;

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
    <div className="fullpage__container modal__container">
      {isDeleting ? (
        <div>
          <HalfCircleSpinner color="var(--base-yellow)" size={76} />
        </div>
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
