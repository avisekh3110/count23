export const getDaysLeft = () => {
  const date = new Date();
  const year = date.getFullYear();
  const daysTillDec31 = new Date(year, 12, 1).getTime() - date.getTime();
  const daysLeft = Math.floor(daysTillDec31 / (1000 * 60 * 60 * 24));
  return daysLeft;
};

export const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  return yesterday;
};
