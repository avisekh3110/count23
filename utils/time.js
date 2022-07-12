export const getDaysLeft = () => {
  const date = new Date();
  const year = date.getFullYear();
  const daysTillDec31 = new Date(year, 12, 1).getTime() - date.getTime();
  const daysLeft = Math.floor(daysTillDec31 / (1000 * 60 * 60 * 24));
  return daysLeft;
};

export const getToday = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today;
};

export const getYesterday = () => {
  const today = getToday();
  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  return yesterday;
};

export const getDaysPassed = (dateString) => {
  const today = getToday().getTime();
  console.log("today:", today);
  const date = new Date(dateString);
  const dateNoon = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    5
  );
  console.log("date:", dateNoon);
  const daysPassed = Math.floor((today - dateNoon) / (1000 * 60 * 60 * 24));
  return daysPassed;
};
