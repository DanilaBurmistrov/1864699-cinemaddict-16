import AbstractObservable from '../utils/abstract-observable';
import { UpdateType } from '../constants';

export default class FilmsModel extends AbstractObservable{
  #filmsList = [];
  #commentsModel = null;
  #apiService;

  constructor(apiService, commentsModel) {
    super();
    this.#apiService = apiService;
    this.#commentsModel = commentsModel;
  }

  set filmsList(filmsList) {
    this.#filmsList = [...filmsList];
  }

  get filmsList() {
    return this.#filmsList;
  }

  init = async () => {
    try {
      const filmsList = await this.#apiService.filmsList;
      this.#filmsList = filmsList.map(this.#adaptToClient);
    } catch(err) {
      this.#filmsList = [];
    }

    this._notify(UpdateType.INIT);
  }

  get watchedFilmsList() {
    return this.#filmsList.filter((film) => film.isWatched);
  }

  getFilmById = (idFilm) => {
    const index = this.#filmsList.findIndex((film) => film.id === idFilm);

    if (index === -1) {
      throw new Error('Can\'t get unexisting film');
    }

    return this.filmsList[index];
  }

  updateFilm = async (updateType, update) => {
    const index = this.#filmsList.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#filmsList = [
        ...this.#filmsList.slice(0, index),
        updatedFilm,
        ...this.#filmsList.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  reloadComments = (filmId) => {
    const index = this.#filmsList.findIndex((item) => item.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t reload comment unexisting film');
    }

    const film = this.#filmsList[index];
    this.#filmsList[index] = {...film, comments: this.#commentsModel.getCommentIdsByFilmId(film.id)};
  }

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      title: film.film_info.title,
      titleOriginal: film.film_info?.alternative_title,
      director: film.film_info?.director,
      writers: film.film_info?.writers,
      actors: film.film_info?.actors,
      duration: film.film_info?.runtime,
      country: film.film_info?.release?.release_country,
      genres: film.film_info?.genre,
      description: film.film_info?.description,
      rating: film.film_info?.total_rating,
      year: new Date (film.film_info?.release.date),
      releaseDate: film.film_info?.release?.date ? new Date(film.film_info.release.date) : null,
      poster: film.film_info?.poster,
      age: film.film_info?.age_rating,
      isWatched: film.user_details?.already_watched,
      isInWatchList: film.user_details?.watchlist,
      watchingDate: film.user_details?.watching_date ? new Date(film.user_details.watching_date) : null,
      isFavorite: film.user_details?.favorite,
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }
}
