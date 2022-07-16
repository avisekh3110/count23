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
  yesterday.setHours(18, 0, 0, 0);
  return yesterday;
};

export const getDaysPassed = (lastUpdatedString) => {
  const today = getToday().getTime();
  const lastUpdated = new Date(lastUpdatedString);
  const daysPassed = Math.floor(
    (today - lastUpdated + 1) / (1000 * 60 * 60 * 24)
  );
  return daysPassed;
};
