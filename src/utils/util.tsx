import { WordType } from "../types/list_types";

export const getRandomId = () => {
  return (
    Date.now().toString(36) + Math.random().toString(36).split(".").join("")
  );
};

export const getRandomIndexInArray = (length: number) => {
  return Math.floor(Math.random() * length);
};

export const getRandomWord = (list: WordType[]) => {
  const index = getRandomIndexInArray(list.length);
  return list[index];
};

export const createAnswerArr = (answer: string, word2: string) => {
  const MAX_LENGTH = answer.length > 4 ? 2 : 4;
  const randomIndex = getRandomIndexInArray(word2.length);
  const sliceLength =
    randomIndex > 4 ? MAX_LENGTH : randomIndex === 0 ? 1 : randomIndex;
  const randomLetters = word2.slice(0, sliceLength);

  const shuffledWord = randomizeLetters(answer.concat(randomLetters));

  const answerArr = shuffledWord.split("").map((letter) => ({
    letter,
    selected: false,
    id: getRandomId(),
  }));

  return answerArr;
};

export const randomizeLetters = (word: string) => {
  let wordArray = word.split("");

  // Keep shuffling the letters until the shuffled word is different from the original word
  let shuffledWord = word;
  while (shuffledWord === word) {
    // Shuffle the letters using the Fisher-Yates shuffle algorithm
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    // Convert the shuffled array back to a word
    shuffledWord = wordArray.join("");
  }

  // Return the shuffled word
  return shuffledWord;
};

export const getDate = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const second = new Date().getSeconds();

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
