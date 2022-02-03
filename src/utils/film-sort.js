import dayjs from 'dayjs';

export const sortRatingDown = (prev, next) =>
  next.rating - prev.rating;

export const sortReleaseDateDown = (prev, next) =>
  dayjs(next.releaseDate).diff(dayjs(prev.releaseDate));
