import { KeysName } from '../constants';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import {FilmActionType, UpdateType} from '../constants';
import {render,
  RenderPosition,
  remove,
  replace} from '../render.js';

export class FilmPresenter {
#container = null;
#changeData = null;
#commentsModel;
#changeComment = null;
#film  = null;
#filmCardComponent = null;
#popupComponent = null;
#siteFooter = document.querySelector('.footer');
_callback = {};

constructor(container, changeData, commentsModel, changeComment) {
  this.#container = container;
  this.#changeData = changeData;
  this.#commentsModel = commentsModel;
  this.#changeComment = changeComment;
}

get filmId () {
  return this.#film.id;
}

init = (film) => {
  this.#film = film;

  const prevFilmComponent = this.#filmCardComponent;
  this.#filmCardComponent = new FilmCardView(film);

  this.#filmCardComponent.setClickHandler(this.#handleCardClick);
  this.#filmCardComponent.setActionHandler(this.#handlerFilmAction);

  if(prevFilmComponent === null) {
    render(this.#container, this.#filmCardComponent);
    return;
  }

  replace(this.#filmCardComponent, prevFilmComponent);
  remove(prevFilmComponent);
}

openPopup = () => {
  const filmComments = this.#commentsModel.getCommentsByFilmId(this.#film.id);
  const prevPopupComponent = this.#popupComponent;
  this.#popupComponent = new FilmPopupView(this.#film, filmComments);

  this.#popupComponent.setCloseClickHandler(this.#handleClosePopup);
  this.#popupComponent.setActionHandler(this.#handlerFilmAction);
  this.#popupComponent.setCommentActionHandler(this.#handlerCommentAction);

  document.body.classList.add('hide-overflow');

  render(this.#siteFooter, this.#popupComponent, RenderPosition.AFTEREND);

  if(prevPopupComponent === null) {
    render(this.#siteFooter, this.#popupComponent, RenderPosition.AFTEREND);
    document.addEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('keydown', this.#ctrEnterDownHandler);
    return;
  }

  replace(this.#popupComponent, prevPopupComponent);
  remove(prevPopupComponent);
}

removePopup() {
  document.removeEventListener('keydown', this.#onEscKeyDown);
  document.removeEventListener('keydown', this.#ctrEnterDownHandler);
  document.body.classList.remove('hide-overflow');

  if(this.#popupComponent !== null) {
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
  this._callback.cardClick =  callback;
}

setCardClose = (callback) => {
  this._callback.cardClose =  callback;
}

#handleCardClick = () => {
  this._callback.cardClick();
}

#handleClosePopup = () => {
  this.removePopup();
  this._callback.cardClose();
}

#handlerFilmAction = (type) => {
  switch (type) {
    case FilmActionType.ADD_WATCH_LIST:
      this.#changeData(
        UpdateType.PATCH, {...this.#film, isInWatchList: !this.#film.isInWatchList});
      break;

    case FilmActionType.MARK_WATCHED:
      this.#changeData(
        UpdateType.PATCH, {...this.#film, isWatched: !this.#film.isWatched});
      break;

    case FilmActionType.MARK_FAVORITE:
      this.#changeData(
        UpdateType.PATCH, {...this.#film, isFavorite: !this.#film.isFavorite});
      break;
  }

}

#handlerCommentAction = (type, comment ) => {
  this.#changeComment(type, UpdateType.MINOR, comment);
}

destroy = () => {
  if(this.#popupComponent){
    this.#popupComponent.saveScroll();
  }
  remove(this.#filmCardComponent);
}

}
