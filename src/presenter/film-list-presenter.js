import { FilmListNames } from '../render.js';
import FilmListView from '../view/film-list-view.js';
import { FilmPresenter } from './film-card-presenter.js';
import FilmsView from '../view/films-view.js';
import NoFilmsView from '../view/no-films-view.js';
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../render.js';
import { SortTypes } from '../render.js';
import ShowButtonView from '../view/show-button-view.js';
import SortView from '../view/sort-view.js';
import {
  sortRatingDown,
  sortReleaseDateDown
} from '../utils/film-sort.js';
import { updateItem } from '../utils/common.js';
import FilmsExtraTopRatedView from '../view/film-extra-top-rated-view.js';
import FilmsExtraMostCommentedView from '../view/film-extra-most-commented-view.js';

const FILM_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

export default class FilmListPresenter {
  #container = null;

  #filmsListComponent = new FilmListView();
  #filmsComponent = new FilmsView();
  #filmsExtraTopRatedComponent = new FilmsExtraTopRatedView();
  #filmsExtraMostCommentedComponent = new FilmsExtraMostCommentedView();
  #sortComponent = new SortView();
  #showMoreComponent = new ShowButtonView();
  #filmsList = [];

  #sourceFilmList = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmPresenerWithPopup = null;
  #currentSortType = SortTypes.DEFAULT;

  constructor(container) {
    this.#container = container;
  }

  init = (filmList) => {
    this.#filmsList = [...filmList];
    this.#sourceFilmList = [...filmList];

    this.#renderSort();
    this.#initFilms();
  }

  #sortFilmList = (sortType) => {
    switch (sortType) {
      case SortTypes.DATE:
        this.#filmsList.sort(sortReleaseDateDown);
        break;
      case SortTypes.RATING:
        this.#filmsList.sort(sortRatingDown);
        break;
      default:
        this.#filmsList = [...this.#sourceFilmList];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#reRenderSort(sortType);

    this.#sortFilmList(sortType);
    this.#clearFilmList();
    this.#renderFilmsList(this.#filmsList);
  }

  #reRenderSort = (sortType) => {
    const updatedSortComponent = new SortView(sortType);
    replace(updatedSortComponent, this.#sortComponent);
    updatedSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    this.#sortComponent = updatedSortComponent;
  }

  #renderSort = () => {
    render(this.#container, this.#sortComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#filmsList = updateItem(this.#filmsList, updatedFilm);
    this.#sourceFilmList = updateItem(this.#sourceFilmList, updatedFilm);

    this.#filmPresenter.get(FilmListNames.ALL_FILMS + updatedFilm.id)?.init(updatedFilm);
    this.#filmPresenter.get(FilmListNames.TOP_RATED + updatedFilm.id)?.init(updatedFilm);
    this.#filmPresenter.get(FilmListNames.MOST_COMMENTED + updatedFilm.id)?.init(updatedFilm);

    if (this.#filmPresenerWithPopup) {
      this.#filmPresenerWithPopup.openPopup();
    }

  }

  #handleCardClick = (filmPresenter) => {
    if (this.#filmPresenerWithPopup) {
      this.#filmPresenerWithPopup.removePopup();
    }
    filmPresenter.openPopup();
    this.#filmPresenerWithPopup = filmPresenter;
  };

  #handleCardClose = () => {
    this.#filmPresenerWithPopup = null;
  }

  #initFilms = () => {
    render(this.#container, this.#filmsComponent);
    if (this.#filmsList.length === 0) {
      render(this.#container, new NoFilmsView());
      return;
    }
    this.#renderFilmsList(this.#filmsList);
    this.#renderMostCommentedFilms();
    this.#renderTopRatedFilms();
  }

  #renderFilmCard = (container, film, cardType) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange);
    filmPresenter.setCardClick(() => this.#handleCardClick(filmPresenter));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);

    this.#filmPresenter.set(cardType + film.id, filmPresenter);
  };

  #renderFilms = (container, films, cardType) => {
    films
      .forEach((film) => this.#renderFilmCard(container, film, cardType));
  }

  #renderPagedFilms = (container, cardType, from, to) => {

    this.#renderFilms(container, this.#sourceFilmList.slice(from, to), cardType);
  }

  #renderFilmsList = (films) => {
    render(this.#filmsComponent, this.#filmsListComponent);

    const from = 0;
    const to = Math.min(films.length, FILM_COUNT_PER_STEP);

    this.#renderPagedFilms(this.#filmsListComponent.filmsListContainer, FilmListNames.ALL_FILMS, from, to);

    if (this.#filmsList.length > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  #handleMoreButtonClick = () => {
    const from = this.#renderedFilmCount;
    const to = this.#renderedFilmCount + FILM_COUNT_PER_STEP;
    this.#renderPagedFilms(this.#filmsListComponent.filmsListContainer, FilmListNames.ALL_FILMS, from, to);
    this.#renderedFilmCount = to;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmsListComponent.element, this.#showMoreComponent, RenderPosition.AFTEREND);
    this.#showMoreComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #sortRatingFilms = () => this.#filmsList.sort((prev, next) => next.rating - prev.rating).slice(0, FILMS_EXTRA_COUNT);

  #sortCommentsFilms = () => this.#filmsList.sort((prev, next) => next.comments.length - prev.comments.length).slice(0, FILMS_EXTRA_COUNT);

  #renderTopRatedFilms = () => {
    render(this.#filmsComponent, this.#filmsExtraTopRatedComponent, RenderPosition.BEFOREEND);
    const topRatedContainerElement = this.#filmsExtraTopRatedComponent.element.querySelector('.films-list__container');
    const arr = this.#sortRatingFilms();

    for (let i = 0; i < arr.length; i++) {
      this.#renderFilmCard(topRatedContainerElement, arr[i]);
    }
  }

  #renderMostCommentedFilms = () => {
    render(this.#filmsComponent, this.#filmsExtraMostCommentedComponent, RenderPosition.BEFOREEND);
    const mostCommentedContainerElement = this.#filmsExtraMostCommentedComponent.element.querySelector('.films-list__container');
    const arr = this.#sortCommentsFilms();

    for (let i = 0; i < arr.length; i++) {
      this.#renderFilmCard(mostCommentedContainerElement, arr[i]);
    }
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
  }
}
