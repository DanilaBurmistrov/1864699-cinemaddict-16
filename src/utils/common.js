import dayjs from 'dayjs';
import { MINUTES_IN_HOURS } from '../constants';

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const getHumanFormattedDate = (date) => {
  const diffYear = dayjs(new Date()).diff(dayjs(date), 'year');
  if(diffYear>1){
    return `${diffYear} years ago`;
  }

  const diffMonth = dayjs(new Date()).diff(dayjs(date), 'month');
  if(diffMonth>1) {
    return `${diffMonth} month ago`;
  }

  const diffDays = dayjs(new Date()).diff(dayjs(date), 'day');
  if(diffDays>1){
    return `${diffDays} days ago`;
  }

  const diffHours = dayjs(new Date()).diff(dayjs(date), 'hour');
  if(diffHours>1){
    return `${diffHours} hours ago`;
  }

  const diffMinutes = dayjs(new Date()).diff(dayjs(date), 'minute');
  if(diffMinutes>1){
    return `${diffMinutes} minutes ago`;
  }

  return 'now';
};

export const getTimeOutOfMinutes = (totalMinutes) => {
  const hours = Math.trunc(totalMinutes / MINUTES_IN_HOURS);
  const minutes = totalMinutes % MINUTES_IN_HOURS;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const truncateText = (text, length) =>  text.length > length ? `${text.slice(0, length)}...` : text;

export const calculateUserRating = (filmsWatchedCount) => {
  const UserRankType = {
    NOVICE: 'Novice',
    FAN: 'Fan',
    MOVIE_BUFF: 'Movie Buff',
  };

  if (filmsWatchedCount === 0) {
    return '';
  }
  if (filmsWatchedCount <= 10) {
    return UserRankType.NOVICE;
  }
  if (filmsWatchedCount <= 20) {
    return UserRankType.FAN;
  }

  return UserRankType.MOVIE_BUFF;
};
