import FilmsListView from '../view/films-list-view.js';
import FilmPresenter, { State as FilmPresenterViewState } from './film-card-presenter.js';
import FilmsView from '../view/films-view.js';
import { filter } from '../constants';
import { FilterType } from '../constants';
import NoFilmsView from '../view/no-films-view.js';
import {
  render,
  RenderPosition,
  remove
} from '../render.js';
import { SortTypes } from '../constants';
import ShowButtonView from '../view/show-button-view.js';
import SortView from '../view/sort-view.js';
import {
  sortRatingDown,
  sortReleaseDateDown,
} from '../utils/film-sort.js';
import FilmsExtraTopRatedView from '../view/film-extra-top-rated-view.js';
import FilmsExtraMostCommentedView from '../view/film-extra-most-commented-view.js';
import { CommentAction } from '../constants';
import { UpdateType } from '../constants';
import LoadingView from '../view/loading-view.js';

const FILM_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

export default class FilmListPresenter {
  #container = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmsListComponent = null;
  #filmsComponent = new FilmsView();
  #filmsExtraTopRatedComponent = new FilmsExtraTopRatedView();
  #filmsExtraMostCommentedComponent = new FilmsExtraMostCommentedView();
  #sortComponent = new SortView();
  #showMoreComponent = new ShowButtonView();
  #noFilmsComponent = null;
  #filmPopupPresenter = null;
  #loadingComponent = new LoadingView();

  #renderedFilmPage = 1;
  #filmsPresenter = new Map();
  #topRatedFilmsPresenter = new Map();
  #mostCommentedFilmsPresenter = new Map();
  #currentSortType = SortTypes.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(container, filmsModel, commentsModel, filterModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
  }

  get filmsList() {
    this.#filterType = this.#filterModel.filter;
    const { filmsList } = this.#filmsModel;
    const filteredFilmsList = filter[this.#filterType](filmsList);

    switch (this.#currentSortType) {
      case SortTypes.DATE:
        return filteredFilmsList.sort(sortReleaseDateDown);
      case SortTypes.RATING:
        return filteredFilmsList.sort(sortRatingDown);
    }

    return filteredFilmsList;
  }

  get topRatedFilmsList() {
    const filmsList = this.#filmsModel.filmsList.slice();
    return filmsList.sort((prev, next) => next.rating - prev.rating).slice(0, FILMS_EXTRA_COUNT);
  }

  get mostCommentedFilmsList() {
    const filmsList = this.#filmsModel.filmsList.slice();
    return filmsList.sort((prev, next) => next.comments.length - prev.comments.length).slice(0, FILMS_EXTRA_COUNT);
  }

  init = () => {

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderMainContainer({ resetRenderedFilmCount: true, resetSortType: true });
  }

  destroy = () => {
    this.#clearMainContainer({ resetRenderedFilmCount: true, resetSortType: true });

    remove(this.#filmsListComponent);
    remove(this.#sortComponent);
    remove(this.#showMoreComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleCommentEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.LOADED_COMMENTS:
        this.#handleLoadedComments(data);
        break;
      case UpdateType.PATCH:
        this.#clearMainContainer();
        this.#renderMainContainer();
        break;
      case UpdateType.MINOR:
        this.#clearMainContainer();
        this.#renderMainContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearMainContainer({ resetRenderedFilmCount: true, resetSortType: true });
        this.#renderMainContainer();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderMainContainer();
        break;
    }
  }

  #handleCommentEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.LOADED_COMMENTS:
        this.#handleModelEvent(updateType, data);
        break;
      case UpdateType.MINOR:
        this.#handleModelEvent(updateType, data);
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearMainContainer({ resetRenderedFilmCount: true });
    this.#renderMainContainer();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#container, this.#sortComponent);
  }

  #handleFilmChange = (updateType, updatedFilm) => {
    this.#filmsModel.updateFilm(updateType, updatedFilm);
  }

  #handleCommentChange = async (actionType, updateType, update) => {
    switch (actionType) {
      case CommentAction.DELETE:
        this.#filmPopupPresenter.setViewState(FilmPresenterViewState.DELETING, update.comment.id);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch (err) {
          this.#filmPopupPresenter.setAborting();
        }
        break;
      case CommentAction.ADD:
        this.#filmPopupPresenter.setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch (err) {
          this.#filmPopupPresenter.setAborting();
        }
        break;
    }
  }

  #handleCardClick = (filmPresenter) => {
    if (this.#filmPopupPresenter) {
      this.#filmPopupPresenter.removePopup();
    }
    filmPresenter.openPopup();
    this.#filmPopupPresenter = filmPresenter;
  };

  #handleCardClose = () => {
    this.#filmPopupPresenter = null;
  }

  #initFilms = () => {
    render(this.#container, this.#filmsComponent);
    this.#renderFilmsList(this.filmsList);
  }

  #renderFilmCard = (container, film, filmsPresenter) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#commentsModel, this.#handleCommentChange);
    filmPresenter.setCardClick(() => this.#handleCardClick(filmPresenter, film.id));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);

    filmsPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (container, films, filmsPresenter) => {
    films
      .forEach((film) => this.#renderFilmCard(container, film, filmsPresenter));
  }

  #renderPagedFilms = (container, from, to) => {
    this.#renderFilms(container, this.filmsList.slice(from, to), this.#filmsPresenter);
  }

  #renderFilmsList = (films) => {
    this.#filmsListComponent = new FilmsListView();
    render(this.#filmsComponent, this.#filmsListComponent, RenderPosition.AFTERBEGIN);

    const filmsCount = films.length;

    const from = 0;
    let to = this.#renderedFilmPage * FILM_COUNT_PER_STEP;

    if (to > filmsCount) {
      to = filmsCount;
      this.#renderedFilmPage = Math.ceil(to / FILM_COUNT_PER_STEP);
    }

    this.#renderPagedFilms(this.#filmsListComponent.filmsListContainer, from, to);

    if (to < filmsCount) {
      this.#renderMoreButton();
    }
  }

  #handleMoreButtonClick = () => {
    const filmsCount = this.filmsList.length;

    const from = this.#renderedFilmPage * FILM_COUNT_PER_STEP;
    let to = from + FILM_COUNT_PER_STEP;

    this.#renderedFilmPage++;

    if (to > filmsCount) {
      to = filmsCount;
      this.#renderedFilmPage = Math.ceil(to / FILM_COUNT_PER_STEP);
    }

    this.#renderPagedFilms(this.#filmsListComponent.filmsListContainer, from, to);

    if (to >= filmsCount) {
      remove(this.#showMoreComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmsListComponent.element, this.#showMoreComponent, RenderPosition.BEFOREEND);
    this.#showMoreComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #renderExtraFilmsComponent = () => {
    render(this.#filmsComponent, this.#filmsExtraTopRatedComponent, RenderPosition.BEFOREEND);
    const topRatedContainerElement = this.#filmsExtraTopRatedComponent.filmsExtraTopRatedContainer;
    this.#renderFilms(topRatedContainerElement, this.topRatedFilmsList, this.#topRatedFilmsPresenter);

    render(this.#filmsComponent, this.#filmsExtraMostCommentedComponent, RenderPosition.BEFOREEND);
    const mostCommentedContainerElement = this.#filmsExtraMostCommentedComponent.filmsExtraMostCommentedContainer;
    this.#renderFilms(mostCommentedContainerElement, this.mostCommentedFilmsList, this.#mostCommentedFilmsPresenter);
  }


  #renderNoFilmsComponent = () => {
    render(this.#container, this.#filmsComponent);

    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    render(this.#filmsComponent, this.#noFilmsComponent, RenderPosition.BEFOREBEGIN);
  }

  #reloadPoppup = () => {
    if (this.#filmPopupPresenter) {
      const filmOnPopup = this.#filmsModel.getFilmById(this.#filmPopupPresenter.filmId);
      this.#filmPopupPresenter.init(filmOnPopup);
      this.#filmPopupPresenter.openPopup();
    }
  }

  #renderLoading = () => {
    render(this.#filmsComponent, this.#loadingComponent, RenderPosition.BEFOREBEGIN);
  }

  #handleLoadedComments = ({ filmId }) => {
    if (this.#filmPopupPresenter?.filmId === filmId) {
      this.#filmPopupPresenter.openPopup();
    }
  }

  #clearMainContainer = ({ resetRenderedFilmCount = false, resetSortTypes = false } = {}) => {

    this.#filmsPresenter.forEach((presenter) => presenter.destroy());
    this.#filmsPresenter.clear();
    this.#topRatedFilmsPresenter.forEach((presenter) => presenter.destroy());
    this.#topRatedFilmsPresenter.clear();
    this.#mostCommentedFilmsPresenter.forEach((presenter) => presenter.destroy());
    this.#mostCommentedFilmsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreComponent);
    remove(this.#filmsListComponent);
    remove(this.#filmsComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (this.#filmPopupPresenter) {
      this.#filmPopupPresenter.destroy();
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmPage = 1;
    }

    if (resetSortTypes) {
      this.#currentSortType = SortTypes.DEFAULT;
    }
  }

  #renderMainContainer = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const filmsCount = this.filmsList.length;
    if (filmsCount === 0) {
      this.#renderNoFilmsComponent();
      return;
    }
    this.#reloadPoppup();
    this.#renderExtraFilmsComponent();
    this.#renderSort();
    this.#initFilms();
  }
}
