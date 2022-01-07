import {FilmListNames} from '../render.js';
import FilmListView from '../view/film-list-view.js';
import { FilmPresenter } from './film-list-presenter.js';
import NoFilmsView from '../view/no-films-view.js';
import {render,
  RenderPosition,
  remove,
  replace} from '../render.js';
import { SortTypes } from '../render.js';
import ShowButtonView from '../view/show-button-view.js';
import SortView from '../view/sort-view.js';
import { sortRatingDown,
  sortCommentCountDown,
  sortReleaseDateDown } from '../utils/film-sort.js';
import { updateItem } from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

export default class FilmCardPresenter {
  #container = null;

  #filmListComponent = new FilmListView();
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
    this.#renderSectionFilms();
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
    this.#initFilmList();
  }

  #reRenderSort = (sortType) =>  {
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

    if(this.#filmPresenerWithPopup) {
      this.#filmPresenerWithPopup.openPopup();
    }

  }

  #handleCardClick = (filmPresenter) => {
    if(this.#filmPresenerWithPopup) {
      this.#filmPresenerWithPopup.removePopup();
    }
    filmPresenter.openPopup();
    this.#filmPresenerWithPopup = filmPresenter;
  };

  #handleCardClose = () => {
    this.#filmPresenerWithPopup = null;
  }

  #renderSectionFilms = () => {
    render(this.#container, this.#filmListComponent);
    this.#initFilmList();
  }

  #renderFilmCard = (containerId, film) => {
    const container = this.#filmListComponent.getFilmList(containerId);
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange);
    filmPresenter.setCardClick(() => this.#handleCardClick(filmPresenter));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);

    this.#filmPresenter.set(containerId + film.id, filmPresenter);
  };

  #renderFilms = (containerId, films, from, to) => {
    if(films.length === 0) {
      render(this.#container, new NoFilmsView());
    } else {
      films
        .slice(from, to)
        .forEach((film) => this.#renderFilmCard(containerId, film));
    }
  }

  #renderMainFilmList = (films) => {
    const from = 0;
    const to = Math.min(films.length, FILM_COUNT_PER_STEP);

    this.#renderFilms(FilmListNames.ALL_FILMS, films, from, to);

    if (this.#filmsList.length > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  get filmsOrderedByTopRated() {
    return [...this.#filmsList].sort(sortRatingDown);
  }

  get filmsOrderedByCommentCount() {
    return [...this.#filmsList].sort(sortCommentCountDown);
  }

  #handleMoreButtonClick = () => {
    const from = this.#renderedFilmCount;
    const to = this.#renderedFilmCount + FILM_COUNT_PER_STEP;
    this.#renderFilms(FilmListNames.ALL_FILMS, this.#filmsList, from, to);
    this.#renderedFilmCount = to;

    if (this.#renderedFilmCount >= this.#filmsList.length) {
      remove(this.#showMoreComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmListComponent.allListElement, this.#showMoreComponent, RenderPosition.AFTEREND);
    this.#showMoreComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #initFilmList = () => {
    this.#renderMainFilmList(this.#filmsList);
    this.#renderFilms(FilmListNames.TOP_RATED, this.filmsOrderedByTopRated, 0, FILM_TOP_RATED_COUNT);
    this.#renderFilms(FilmListNames.MOST_COMMENTED, this.filmsOrderedByCommentCount, 0, FILM_MOST_COMMENTED_COUNT);
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
  }
}
