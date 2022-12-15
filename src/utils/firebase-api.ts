import { database } from "../firebase/firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import type {
  ListType,
  UpdatedWordArgs,
  ListRef,
  WordRef,
  UpdateTitleArgs,
} from "../types/list_types";

import { getDate } from "./util";

/////// Write / Add data ///////

export const createNewList = async (userID: string, title: string) => {
  const date = getDate();
  await addDoc(collection(database, userID), { title, date });
  return getListID(userID, title);
};

export const addWordToList = async ({
  userID,
  listID,
  wordID,
  newWord,
}: UpdatedWordArgs) => {
  await setDoc(doc(database, userID, listID, "words", wordID), newWord);
};

/////// Write / Add data - End///////

/////// Read / Get Data ///////

export const getAllLists = async (userID: string) => {
  let listWithWords: ListType[] = [];

  try {
    // fetch all docs (lists) from firebase
    const getAllDocs = await getDocs(collection(database, userID));

    // create array with docs's fields data
    const listsData = getAllDocs.docs.map((doc) => {
      return { listID: doc.id, title: doc.data().title, date: doc.data().date };
    });

    // loop through array to fetch words in subcollection for each list
    for (const list of listsData) {
      const { listID, title, date } = list;

      const query = await getDocs(
        collection(database, userID, listID, "words")
      );

      const words = query.docs.map((d) => ({
        wordID: d.id,
        word: d.data().word,
        translation: d.data().translation,
      }));

      listWithWords.push({ listID, title, date, words });
    }

    return listWithWords;
    //
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    return (listWithWords = []);
  }
};

export const getListByID = async ({ userID, listID }: ListRef) => {
  let list: ListType = { listID: "", title: "", date: "", words: [] };

  try {
    // fetch list
    const listRef = doc(database, userID, listID);
    const listData = await getDoc(listRef);

    // save list data in var
    if (listData.exists()) {
      list.listID = listData.id;
      list.title = listData.data().title;
      list.date = listData.data().date;
    }

    // fetch words from list
    const wordsListRef = collection(database, userID, listID, "words");
    const wordsData = await getDocs(wordsListRef);

    // save words data in var
    for (const item of wordsData.docs) {
      const wordID = item.id;
      const word = item.data().word;
      const translation = item.data().translation;

      list.words.push({ wordID, word, translation });
    }

    return list;
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    return list;
  }
};

export const getListID = async (userID: string, title: string) => {
  const docRef = collection(database, userID);
  const docLists = await getDocs(docRef);
  let listID: string = "";

  try {
    docLists.docs.find((doc) =>
      doc.data().title === title ? (listID = doc.id) : null
    );

    return listID;
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    return listID;
  }
};

export const getListTitle = async ({ userID, listID }: ListRef) => {
  const docRef = collection(database, userID);
  const docLists = await getDocs(docRef);
  let listTitle: string = "";

  try {
    docLists.docs.find((doc) =>
      doc.id === listID ? (listTitle = doc.data().title) : null
    );

    return listTitle;
  } catch (err) {
    console.log(`An error has occured: ${err}`);
    return listTitle;
  }
};

/////// Read / Get Data - End ///////

/////// Delete Data ///////

export const deleteWordFromList = async ({
  userID,
  listID,
  wordID,
}: WordRef) => {
  const wordRef = doc(database, userID, listID, "words", wordID);
  await deleteDoc(wordRef);
};

export const deleteList = async ({ userID, listID }: ListRef) => {
  const wordsListRef = collection(database, userID, listID, "words");
  const listDocs = await getDocs(wordsListRef);

  // in order to delete a doc (list) in firebase
  // you must first delete all subcollections (words)
  for (const word of listDocs.docs) {
    const wordRef = doc(database, userID, listID, "words", word.id);
    await deleteDoc(wordRef);
  }

  // then you can delete the doc
  const docRef = doc(database, userID, listID);
  await deleteDoc(docRef);
};

/////// Update Data ///////

export const updateWord = async ({
  userID,
  listID,
  wordID,
  newWord,
}: UpdatedWordArgs) => {
  const wordRef = doc(database, userID, listID, "words", wordID);
  await updateDoc(wordRef, newWord);
};

export const updateListTitle = async ({
  userID,
  listID,
  newTitle,
}: UpdateTitleArgs) => {
  const listRef = doc(database, userID, listID);
  const list = await getDoc(listRef);
  const date = list.data()?.date;

  await setDoc(listRef, {
    title: newTitle,
    date,
  });
};
