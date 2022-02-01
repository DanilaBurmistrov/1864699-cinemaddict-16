import AbstractView from './abstract-view';
import { calculateUserRating } from '../utils/common';

const createUserRatingTemplate = (filmsWatchedCount) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${calculateUserRating(filmsWatchedCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`
);

export default class UserRatingView extends AbstractView {
  #filmsModel = null;
  #filmsWatchedCount = null;

  constructor (filmsModel) {
    super();
    this.#filmsModel = filmsModel;
    this.#filmsWatchedCount = this.#filmsModel.filmsList.filter((film) => film.isWatched === true).length;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  #handleModelEvent = (update) => {
    if (update) {
      this.#filmsWatchedCount = this.#filmsModel.filmsList.filter((film) => film.isWatched === true).length;
      this.element.querySelector('.profile__rating').textContent = calculateUserRating(this.#filmsWatchedCount);
    }
  }

  get template() {
    return createUserRatingTemplate(this.#filmsWatchedCount);
  }
}
