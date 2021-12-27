const filmToFilterMap = {
  watchList: (filmList) => filmList.filter((film) => film.isInWatchList).length,
  history: (filmList) => filmList.filter((film) => film.isWatched).length,
  favorites: (filmList) => filmList.filter((film) => film.isFavorite).length,
};

export const generateFilters = (filmList) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilmList]) => ({
    name: filterName,
    count: countFilmList(filmList),
  }),
);
