import { FilmActionType, CommentAction } from '../render';
import { getFormattedDate } from '../utils/common';
import SmartView from './smart-view';

const generateGenresTemplate = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

const generateComment = (comment) => {
  const {
    emoji,
    text,
    author,
    day
  } = comment;

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emoji}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getFormattedDate(day, 'YYYY/MM/DD HH:mm')}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
};

const generateCommentTemplate = (commentList) => commentList.map((comment) => generateComment(comment)).join('');
const createCommentEmojiTemplate = (emoji) => emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : '';

const createFilmDetailsTemplate = (film) => {
  const {
    title,
    director,
    writers,
    actors,
    duration,
    countries,
    genre,
    description,
    rating,
    releaseDate,
    poster,
    age,
    isFavorite,
    isWatched,
    isInWatchList,
    comments,
    commentEmoji,
    comment,
  } = film;

  const activeClassName = (item) => item ? 'film-details__control-button--active' : '';
  const checkedEmoji = (emoji) => commentEmoji === emoji ? 'checked="checked"' : '';


  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">
          <p class="film-details__age">${age}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${countries}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${generateGenresTemplate(genre)}</td>
            </tr>
          </table>
          <p class="film-details__film-description">${description}</p>
        </div>
      </div>
      <section class="film-details__controls">
        <button type="button" data-action-type="${FilmActionType.ADD_WATCH_LIST}"
                class="film-details__control-button
                      film-details__control-button--watchlist
                      ${activeClassName(isInWatchList)}"
                id="watchlist" name="watchlist">
                Add to watchlist
        </button>
        <button type="button" data-action-type="${FilmActionType.MARK_WATCHED}"
                class="film-details__control-button
                      film-details__control-button--watched
                      ${activeClassName(isWatched)}"
                id="watched" name="watched">
                Already watched
        </button>
        <button type="button" data-action-type="${FilmActionType.MARK_FAVORITE}"
                class="film-details__control-button
                      film-details__control-button--favorite
                      ${activeClassName(isFavorite)}"
                id="favorite" name="favorite">
                Add to favorites
        </button>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${generateCommentTemplate(comments)}
        </ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${createCommentEmojiTemplate(commentEmoji)}</div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
          </label>
          <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${checkedEmoji('smile')} type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${checkedEmoji('sleeping')} type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${checkedEmoji('puke')} type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${checkedEmoji('angry')} type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopupView extends SmartView {
  _scrollPosition = 0;
  #elementScroll;
  #newElementScroll;
  #comments = [];

  constructor(film, comments) {
    super();

    this._data = FilmPopupView.parseFilmToData(film);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsTemplate(this._data);
  }

  get closeButtonElement() {
    return this.element.querySelector('.film-details__close-btn');
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.closeButtonElement.addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
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

  setCommentActionHandler = (callback) => {
    this._callback.commentAction = callback;

    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => {
      button.addEventListener('click', this.#deleteCommentHandler);
    });
  }

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    const  commentId = evt.target.dataset.commentId;
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    this._callback.commentAction(CommentAction.DELETE, this.#comments[index]);
  }

  addCommentHandler = () => {
    const newComment = {
      idFilm: this._data.id,
      emoji: this._data.commentEmoji ? `./images/emoji/${this._data.commentEmoji}.png` : null,
      text: this._data.comment
    };

    this._callback.commentAction(CommentAction.ADD, newComment);
  }

  static parseFilmToData = (film) => ({...film,
    comment: '',
    commentEmoji: null,
  });

  static parseDataToFilm = (data) => {
    const film = {...data};
    delete film.comment;
    delete film.commentEmoji;

    return film;
  };

  reset = (film) => {
    this.updateData(
      FilmPopupView.parseFilmToData(film),
    );
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('input[name="comment-emoji"]').forEach((input) => {
      input.addEventListener('click', this.#changeCommentEmoji);
    });
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #changeCommentEmoji = (evt) => {
    evt.preventDefault();
    this.saveScrollPosition();
    this.updateData({
      commentEmoji: evt.target.value,
    });
    this.setScrollPosition();
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setActionHandler(this._callback.action);
    this.setCommentActionHandler(this._callback.commentAction);
  }

  saveScrollPosition = () => {
    this.#elementScroll = document.querySelector('.film-details');
    this._scrollPosition = this.#elementScroll.scrollTop;
  }

  setScrollPosition = () => {
    this.#newElementScroll = document.querySelector('.film-details');
    this.#newElementScroll.scrollTop = this._scrollPosition;
  }

}
