import dayjs from 'dayjs';
import { MINUTES_IN_HOURS, UserRating } from '../constants';

export const getHumanFormattedDate = (date) => {
  const diffYear = dayjs(new Date()).diff(dayjs(date), 'year');
  if (diffYear > 1) {
    return `${diffYear} years ago`;
  }

  const diffMonth = dayjs(new Date()).diff(dayjs(date), 'month');
  if (diffMonth > 1) {
    return `${diffMonth} month ago`;
  }

  const diffDays = dayjs(new Date()).diff(dayjs(date), 'day');
  if (diffDays > 1) {
    return `${diffDays} days ago`;
  }

  const diffHours = dayjs(new Date()).diff(dayjs(date), 'hour');
  if (diffHours > 1) {
    return `${diffHours} hours ago`;
  }

  const diffMinutes = dayjs(new Date()).diff(dayjs(date), 'minute');
  if (diffMinutes > 1) {
    return `${diffMinutes} minutes ago`;
  }

  return 'now';
};

export const getTimeOutOfMinutes = (totalMinutes) => {
  const hours = Math.trunc(totalMinutes / MINUTES_IN_HOURS);
  const minutes = totalMinutes % MINUTES_IN_HOURS;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const truncateText = (text, length) => text.length > length ? `${text.slice(0, length)}...` : text;


export const getDisplayRating = (watchedCount) => {
  let rating = '';

  if (UserRating.NOVICE.min <= watchedCount && watchedCount <= UserRating.NOVICE.max) {
    rating = UserRating.NOVICE.name;
  } else if (UserRating.FAN.min <= watchedCount && watchedCount <= UserRating.FAN.max) {
    rating = UserRating.FAN.name;
  } else if (UserRating.MOVIE_BUFF.min <= watchedCount) {
    rating = UserRating.MOVIE_BUFF.name;
  }

  return rating;
};
