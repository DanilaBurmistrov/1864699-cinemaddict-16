import AbstractView from './abstract-view';
import { FilmActionType } from '../render';
import { generateFilmInfo } from '../mock/films-info';


const createFilmCardTemplate = () => {

  const filmInfo = generateFilmInfo();

  const activeButtonClassName = (isActive) => isActive ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmInfo.releaseDate}</span>
      <span class="film-card__duration">${filmInfo.duration}</span>
      <span class="film-card__genre">${filmInfo.genre[0]}</span>
    </p>
    <img src= ${filmInfo.poster} alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description}</p>
    <span class="film-card__comments">${filmInfo.comments.length}</span>
  </a>
  <div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeButtonClassName(!filmInfo.isInWatchList)}"
  data-action-type="${FilmActionType.ADD_WATCH_LIST}" type="button">Add to watchlist</button>
<button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeButtonClassName(filmInfo.isWatched)}"
  data-action-type="${FilmActionType.MARK_WATCHED}" type="button">Mark as watched</button>
<button class="film-card__controls-item film-card__controls-item--favorite ${activeButtonClassName(filmInfo.isFavorite)}"
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
