import { WordInfo, WordType } from "../types/list_types";
import { getRandomId } from "./util";

export const getRandomIndexInArray = (length: number) => {
  return Math.floor(Math.random() * length);
};

export const getRandomWord = (list: WordType[]) => {
  const index = getRandomIndexInArray(list.length);
  return list[index];
};

export const shuffleLetters = (word: string) => {
  let wordArray = word.split("");
  let shuffledWord = word;

  while (shuffledWord === word) {
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    shuffledWord = wordArray.join("");
  }

  return shuffledWord;
};

export const shuffleArray = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const createAnswerArr = (answer: string, word2: string) => {
  // Get letters from another words to display more choices
  // If the answer is already quite long (> 5 letters), only add max
  // 2 new char, else add max 4
  const MAX_LENGTH = answer.length > 5 ? 2 : 4;
  const randomIndex = getRandomIndexInArray(MAX_LENGTH);
  const sliceLength = randomIndex === 0 ? 1 : randomIndex;
  const concatWords = answer.concat(
    shuffleLetters(word2).slice(0, sliceLength)
  );

  return shuffleLetters(concatWords)
    .split("")
    .map((letter) => ({
      letter,
      selected: false,
      id: getRandomId(),
    }));
};

export const createMatchCard: (words: WordType[]) => WordInfo[] = (words) => {
  // shuffle the list, then take 5 words from it
  const shuffledList: WordType[] = shuffleArray(words).slice(0, 5);

  // create two objects for each word (for its word and translation)
  const items = shuffledList.reduce((prev: WordInfo[], item) => {
    const { wordID, word, translation } = item;
    return [
      ...prev,
      { wordID, word, type: "word", isSelected: false, isMatched: false },
      {
        wordID,
        word: translation,
        type: "translation",
        isSelected: false,
        isMatched: false,
      },
    ];
  }, []);

  // return a shuffled version of the array of letters objects
  return shuffleArray(items);
};
