export const MINUTES_IN_HOURS = 60;

export const KeysName = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  CTRL: 'Ctrl'
};

export const FilmActionType = {
  ADD_WATCH_LIST: 'watchList',
  MARK_WATCHED: 'watched',
  MARK_FAVORITE: 'favorite',
};

export const FilmListNames = {
  ALL_FILMS: 'allFilms',
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};

export const SortTypes = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const FilterType = {
  ALL: 'all',
  WATCH_LIST: 'watchList',
  WATCHED: 'watched',
  FAVORITES: 'favorites',
};

export const filter = {
  [FilterType.ALL]: (filmsList) => [...filmsList],
  [FilterType.WATCH_LIST]: (filmsList) => filmsList.filter((film) => film.isInWatchList),
  [FilterType.WATCHED]: (filmsList) => filmsList.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (filmsList) => filmsList.filter((film) => film.isFavorite),
};

export const CommentAction = {
  ADD: 'add',
  DELETE: 'delete',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const MenuItem = {
  FILMS: 'FILMS',
  STATISTICS: 'STATISTICS',
};

export const StatisticsType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const SHORT_DESCRIPTION_NUMBER_OF_SYMBOLS = 140;
