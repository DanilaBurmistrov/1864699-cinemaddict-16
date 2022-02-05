import { KeysName } from '../constants';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import { FilmActionType, UpdateType } from '../constants';
import {
  render,
  RenderPosition,
  remove,
  replace
} from '../render.js';

export const State = {
  LOADING: 'LOADING',
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class FilmPresenter {
  #container = null;
  #changeData = null;
  #commentsModel;
  #changeComment = null;
  #film = null;
  #filmCardComponent = null;
  #popupComponent = null;
  #siteFooter = document.querySelector('.footer');
  #callback = {};

  constructor(container, changeData, commentsModel, changeComment) {
    this.#container = container;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
    this.#changeComment = changeComment;
  }

  get filmId() {
    return this.#film.id;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setClickHandler(this.#handleCardClick);
    this.#filmCardComponent.setActionHandler(this.#handlerFilmAction);

    if (prevFilmComponent === null) {
      render(this.#container, this.#filmCardComponent);
      return;
    }

    replace(this.#filmCardComponent, prevFilmComponent);
    remove(prevFilmComponent);
  }

  openPopup = () => {
    const prevPopupComponent = this.#popupComponent;

    if (!this.#commentsModel.hasComments(this.#film.id)) {
      this.#commentsModel.loadComments(UpdateType.LOADED_COMMENTS, this.#film.id);
    }
    const comments = this.#commentsModel.getComments(this.#film.id);

    this.#popupComponent = new FilmPopupView(this.#film, comments);

    this.#popupComponent.setCloseClickHandler(this.#handleClosePopup);
    this.#popupComponent.setActionHandler(this.#handlerFilmAction);
    this.#popupComponent.setCommentActionHandler(this.#handlerCommentAction);

    document.body.classList.add('hide-overflow');

    render(this.#siteFooter, this.#popupComponent, RenderPosition.AFTEREND);

    if (prevPopupComponent === null) {
      render(this.#siteFooter, this.#popupComponent, RenderPosition.AFTEREND);
      document.addEventListener('keydown', this.#onEscKeyDown);
      document.addEventListener('keydown', this.#ctrEnterDownHandler);
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);
  }

  updatePopup = (film, comments) => {
    if(this.#popupComponent) {
      this.#popupComponent.update(film, comments);
    }
  };

  removePopup() {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('keydown', this.#ctrEnterDownHandler);
    document.body.classList.remove('hide-overflow');

    if (this.#popupComponent !== null) {
      remove(this.#popupComponent);
      this.#popupComponent = null;
    }
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === KeysName.ESC || evt.key === KeysName.ESCAPE) {
      evt.preventDefault();
      this.removePopup();
    }
  }

  #ctrEnterDownHandler = (evt) => {
    if (evt.key === KeysName.ENTER || evt.key === KeysName.CTRL) {
      evt.preventDefault(evt);
      this.#popupComponent.addCommentHandler();
    }
  }

  setCardClick = (callback) => {
    this.#callback.cardClick = callback;
  }

  setCardClose = (callback) => {
    this.#callback.cardClose = callback;
  }

  #handleCardClick = () => {
    this.#callback.cardClick();
  }

  #handleClosePopup = () => {
    this.removePopup();
    this.#callback.cardClose();
  }

  #handlerFilmAction = (type) => {
    switch (type) {
      case FilmActionType.ADD_WATCH_LIST:
        this.#changeData(
          UpdateType.PATCH, { ...this.#film, isInWatchList: !this.#film.isInWatchList });
        break;

      case FilmActionType.MARK_WATCHED:
        this.#changeData(
          UpdateType.PATCH, { ...this.#film, isWatched: !this.#film.isWatched, watchingDate: (!this.#film.isWatched ? new Date(): null) });
        break;

      case FilmActionType.MARK_FAVORITE:
        this.#changeData(
          UpdateType.PATCH, { ...this.#film, isFavorite: !this.#film.isFavorite });
        break;
    }

  }

  #handlerCommentAction = (type, comment) => {
    this.#changeComment(type, UpdateType.MINOR, {comment, filmId: this.#film.id});
  }

  destroy = () => {
    if (this.#popupComponent) {
      this.#popupComponent.saveScroll();
    }
    remove(this.#filmCardComponent);
  }

  setViewState = (state, updateId = null) => {
    const resetFormState = () => {
      this.#popupComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
        deletingCommentId: null,
      });
    };

    switch (state) {
      case State.LOADING:
        this.#popupComponent.updateData({
          isLoading: true,
        });
        break;
      case State.SAVING:
        this.#popupComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#popupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
          deletingCommentId: updateId,
        });
        break;
      case State.ABORTING:
        this.#filmCardComponent.shake(resetFormState);
        this.#popupComponent.shake(resetFormState);
        break;
    }
  }

  setSaving = () => {
    this.#popupComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#popupComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
        deletingCommentId: null,
      });
    };

    this.#popupComponent.shake(resetFormState);
  }

}
