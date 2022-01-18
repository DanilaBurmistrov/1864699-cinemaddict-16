import { CommentAction } from '../render.js';
import { FilmListNames } from '../render.js';
import FilmListView from '../view/film-list-view.js';
import { FilmPresenter } from './film-card-presenter.js';
import FilmsView from '../view/films-view.js';
import { filter } from '../render.js';
import { FilterType } from '../render.js';
import NoFilmsView from '../view/no-films-view.js';
import {
  render,
  RenderPosition,
  remove
} from '../render.js';
import { SortTypes } from '../render.js';
import ShowButtonView from '../view/show-button-view.js';
import SortView from '../view/sort-view.js';
import {
  sortRatingDown,
  sortReleaseDateDown,
} from '../utils/film-sort.js';
import FilmsExtraTopRatedView from '../view/film-extra-top-rated-view.js';
import FilmsExtraMostCommentedView from '../view/film-extra-most-commented-view.js';

const FILM_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

export default class FilmListPresenter {
  #container = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmsListComponent = new FilmListView();
  #filmsComponent = new FilmsView();
  #filmsExtraTopRatedComponent = new FilmsExtraTopRatedView();
  #filmsExtraMostCommentedComponent = new FilmsExtraMostCommentedView();
  #sortComponent = new SortView();
  #showMoreComponent = new ShowButtonView();
  #noFilmsComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmPresenterWithPopup = null;
  #filmIdWithOpenPopup = null;
  #currentSortType = SortTypes.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    /// если раскомментить, то будет ошибка
    // this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filmsList() {
    /// если раскомментить, то будет ошибка
    // this.#filterType = this.#filterModel.filter;
    const filmsList = this.#filmsModel.filmsList;
    const filteredFilmsList = filter[this.#filterType](filmsList);

    switch (this.#currentSortType) {
      case SortTypes.DATE:
        return filteredFilmsList.sort(sortReleaseDateDown);
      case SortTypes.RATING:
        return filteredFilmsList.sort(sortRatingDown);
    }

    return filteredFilmsList;
  }

  init = () => {

    render(this.#container, this.#filmsListComponent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentEvent);
    /// если раскомментить, то будет ошибка
    // this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderMainContainer();
  }

  destroy = () => {
    this.#clearMainContainer({resetRenderedFilmCount: true, resetSortType: true});

    remove(this.#filmsListComponent);
    remove(this.#sortComponent);
    remove(this.#showMoreComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleCommentEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case updateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case updateType.MINOR:
        this.#clearMainContainer();
        this.#renderMainContainer();
        break;
      case updateType.MAJOR:
        this.#clearMainContainer({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderMainContainer();
        break;
    }
  }

  #handleCommentEvent = (updateType, data) => {
    this.#filmsModel.reloadComments(data.idFilm);
    this.#handleModelEvent(updateType, this.#filmsModel.getFilmById(data.idFilm));
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearMainContainer({resetRenderedFilmCount: true});
    this.#renderMainContainer();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#filmsListComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #handleFilmChange = (updateType, updatedFilm) => {
    this.#filmsModel.updateFilm(updateType, updatedFilm);
  }

  #handleCommentChange = (actionType, updateType, update) => {
    switch (actionType) {
      case CommentAction.DELETE:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case CommentAction.ADD:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  }

  #handleCardClick = (filmPresenter, filmId) => {
    this.#filmIdWithOpenPopup = filmId;
    if(this.#filmPresenterWithPopup) {
      this.#filmPresenterWithPopup.removePopup();
    }
    filmPresenter.openPopup();
    this.#filmPresenterWithPopup = filmPresenter;
  };

  #handleCardClose = () => {
    this.#filmPresenterWithPopup = null;
    this.#filmIdWithOpenPopup = null;
  }

  #initFilms = () => {
    const filmsCount = this.filmsList.length;
    render(this.#container, this.#filmsComponent);
    if (filmsCount === 0) {
      render(this.#container, new NoFilmsView());
      return;
    }
    this.#renderFilmsList(this.filmsList);
    this.#renderMostCommentedFilms();
    this.#renderTopRatedFilms();
  }

  #renderFilmCard = (container, film, cardType) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#commentsModel, this.#handleCommentChange);
    filmPresenter.setCardClick(() => this.#handleCardClick(filmPresenter, film));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);

    this.#filmPresenter.set(cardType + film.id, filmPresenter);
  };

  #renderFilms = (container, films, cardType) => {
    films
      .forEach((film) => this.#renderFilmCard(container, film, cardType));
  }

  #renderPagedFilms = (container, cardType, from, to) => {

    this.#renderFilms(container, this.filmsList.slice(from, to), cardType);
  }

  #renderFilmsList = (films) => {
    render(this.#filmsComponent, this.#filmsListComponent);

    const filmsCount = this.filmsList.length;
    const from = 0;
    const to = Math.min(films.length, FILM_COUNT_PER_STEP);

    this.#renderPagedFilms(this.#filmsListComponent.filmsListContainer, FilmListNames.ALL_FILMS, from, to);

    if (filmsCount > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  #handleMoreButtonClick = () => {
    const filmsCount = this.filmsList.length;
    const from = this.#renderedFilmCount;
    const to = this.#renderedFilmCount + FILM_COUNT_PER_STEP;
    this.#renderPagedFilms(this.#filmsListComponent.filmsListContainer, FilmListNames.ALL_FILMS, from, to);
    this.#renderedFilmCount = to;

    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#showMoreComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmsListComponent.element, this.#showMoreComponent, RenderPosition.AFTEREND);
    this.#showMoreComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #sortRatingFilms = () => [...this.filmsList].sort((prev, next) => next.rating - prev.rating).slice(0, FILMS_EXTRA_COUNT);

  #sortCommentsFilms = () => [...this.filmsList].sort((prev, next) => next.comments.length - prev.comments.length).slice(0, FILMS_EXTRA_COUNT);

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

  #clearMainContainer = ({resetRenderedFilmCount = false, resetSortTypes = false} = {}) => {
    const filmsCount = this.filmsList.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreComponent);

    if(this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if(this.#filmPresenterWithPopup) {
      this.#filmPresenterWithPopup.destroy();
    }

    this.#renderedFilmCount = resetRenderedFilmCount ? FILM_COUNT_PER_STEP : Math.min(filmsCount, this.#renderedFilmCount);

    if (resetSortTypes) {
      this.#currentSortType = SortTypes.DEFAULT;
    }
  }

  #renderMainContainer = () => {
    if(this.#filmPresenterWithPopup && this.#filmIdWithOpenPopup) {
      const filmOnPopup = this.#filmsModel.getFilmById(this.#filmIdWithOpenPopup);
      this.#filmPresenterWithPopup.init(filmOnPopup);
      this.#filmPresenterWithPopup.openPopup();
    }

    this.#renderSort();
    this.#initFilms();
  }
}
