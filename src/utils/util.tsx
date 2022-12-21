export const getRandomId = () => {
  return (
    Date.now().toString(36) + Math.random().toString(36).split(".").join("")
  );
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
