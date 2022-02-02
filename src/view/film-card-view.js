import AbstractView from './abstract-view';
import { FilmActionType } from '../constants';
import { SHORT_DESCRIPTION_NUMBER_OF_SYMBOLS } from '../constants';
import { truncateText, getTimeOutOfMinutes } from '../utils/common';

const createFilmCardTemplate = (film) => {
  const {
    title,
    rating,
    releaseDate,
    duration,
    genres,
    poster,
    description,
    comments,
    isInWatchList,
    isWatched,
    isFavorite,
  } = film;

  const activeButtonClassName = (isActive) => isActive ? 'film-card__controls-item--active' : '';
  const isComments = comments.length ? `${comments.length  } comments` : '';
  const [firstGenre] = genres;

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseDate}</span>
      <span class="film-card__duration">${getTimeOutOfMinutes(duration)}</span>
      <span class="film-card__genre">${firstGenre}</span>
    </p>
    <img src= ${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${truncateText(description, SHORT_DESCRIPTION_NUMBER_OF_SYMBOLS)}</p>
    <span class="film-card__comments">${isComments}</span>
  </a>
  <div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeButtonClassName(isInWatchList)}"
  data-action-type="${FilmActionType.ADD_WATCH_LIST}" type="button">Add to watchlist</button>
<button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeButtonClassName(isWatched)}"
  data-action-type="${FilmActionType.MARK_WATCHED}" type="button">Mark as watched</button>
<button class="film-card__controls-item film-card__controls-item--favorite ${activeButtonClassName(isFavorite)}"
  data-action-type="${FilmActionType.MARK_FAVORITE}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;
  #cardLinkElement = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get cardLinkElement() {
    if(!this.#cardLinkElement) {
      this.#cardLinkElement = this.element.querySelector('.film-card__link');
    }
    return this.#cardLinkElement;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.cardLinkElement.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  setActionHandler = (callback) => {
    this._callback.action = callback;
    this.element.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', this.#actionClickHandler);
    });
  }

  #actionClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.action(evt.target.dataset.actionType);
  }
}
