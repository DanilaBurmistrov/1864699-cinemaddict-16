import dayjs from 'dayjs';
import { StatisticsType } from '../constants';

export const countFilmsByGenre = (filmsList, genre) =>
  filmsList.filter((film) => film.genres.some((filmGenre) => filmGenre === genre)).length;

export const getGenresWithCountFromFilmsList = (filmsList) => {
  const genres = new Set();
  filmsList.forEach((film) => {
    film.genres.forEach((genre) => genres.add(genre));
  });
  return Array.from(genres, (genre) => ({
    genre: genre,
    count: countFilmsByGenre(filmsList, genre),
  }));
};

export const sortGenreCountDown = (prev, next) => prev.count - next.count;

export const getTotalDuration = (filmsList) => {
  const initialValue = 0;
  return filmsList.reduce((totalDuration, film) => totalDuration + film.duration, initialValue);
};

export const getDateStartFromStatisticType = (statisticsType) => {
  switch (statisticsType) {
    case StatisticsType.ALL:
      return null;
    case StatisticsType.TODAY:
      return dayjs().startOf('day').toDate();
    case StatisticsType.WEEK:
      return dayjs().subtract(1, 'week').toDate();
    case StatisticsType.MONTH:
      return dayjs().subtract(1, 'month').toDate();
    case StatisticsType.YEAR:
      return dayjs().subtract(1, 'year').toDate();
  }
  return null;
};

export const getFilmsListFilteredByTime = (statisticsType, filmsList) => {
  const startDate = getDateStartFromStatisticType(statisticsType);
  return startDate
    ? filmsList.filter((film) => dayjs(film.watchingDate).isAfter(startDate))
    : filmsList;
};


