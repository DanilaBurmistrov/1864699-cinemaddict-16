import dayjs from 'dayjs';

export const sortRatingDown = (prev, next) =>
  prev.rating - next.rating;

export const sortCommentCountDown = (prev, next) =>
  prev.comments.length - next.comments.length;

export const sortReleaseDateDown = (prev, next) =>
  dayjs(next.releaseDate).diff(dayjs(prev.releaseDate));
