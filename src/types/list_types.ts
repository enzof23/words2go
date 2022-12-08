// Firebase List CRUD functions types

export type ListRef = {
  userID: string;
  listID: string;
};

export type WordRef = {
  wordID: string;
} & ListRef;

export type UpdatedWordArgs = {
  newWord: WordFields;
} & WordRef;

export type UpdateTitleArgs = {
  newTitle: string;
} & ListRef;

// List specific types

export type WordFields = {
  word: string;
  translation: string;
};

export type ListFields = {
  listID: string;
  title: string;
  date: string;
};

export type WordType = {
  wordID: string;
} & WordFields;

export type ListType = {
  words: WordType[];
} & ListFields;
