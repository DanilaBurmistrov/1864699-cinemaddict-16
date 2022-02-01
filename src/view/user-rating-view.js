import { getDisplayRating } from '../utils/common';
import AbstractView from './abstract-view';

const createUserRatingTemplate = (watchedFilms) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${getDisplayRating(watchedFilms)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`
);

export default class UserRatingView extends AbstractView {
  #watchedFilms;

  constructor(count) {
    super();

    this.#watchedFilms = count;
  }

  get template() {
    return createUserRatingTemplate(this.#watchedFilms);
  }
}
