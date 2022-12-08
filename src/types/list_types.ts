import { SetStateAction } from "react";

export type UseStateBooleanType = React.Dispatch<SetStateAction<boolean>>;

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
