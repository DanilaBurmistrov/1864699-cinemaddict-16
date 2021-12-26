import dayjs from 'dayjs';

export const sortRatingDown = (film1, film2) =>
  film1.rating < film2.rating ? 1 : -1;

export const sortCommentCountDown = (film1, film2) =>
  film1.comments.length < film2.comments.length ? 1 : -1;

export const sortReleaseDateDown = (film1, film2) =>
  dayjs(film2.releaseDate).diff(dayjs(film1.releaseDate));
