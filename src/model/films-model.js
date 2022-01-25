import AbstractObservable from '../utils/abstract-observable';

export default class FilmsModel extends AbstractObservable{
  #filmsList = [];
  #commentsModel = null;

  constructor(commentsModel) {
    super();
    this.#commentsModel = commentsModel;
  }

  set filmsList(filmsList) {
    this.#filmsList = [...filmsList];
  }

  get filmsList() {
    return this.#filmsList;
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

  updateFilm = (updateType, update) => {
    const index = this.#filmsList.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#filmsList = [
      ...this.#filmsList.slice(0, index),
      update,
      ...this.#filmsList.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  reloadComments = (filmId) => {
    const index = this.#filmsList.findIndex((item) => item.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t reload comment unexisting film');
    }

    const film = this.#filmsList[index];
    this.#filmsList[index] = {...film, comments: this.#commentsModel.getCommentIdsByFilmId(film.id)};
  }
}
