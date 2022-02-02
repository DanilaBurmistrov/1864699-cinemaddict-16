import AbstractObservable from '../utils/abstract-observable.js';

export default class CommentsModel extends AbstractObservable {
  #comments = new Map();
  #apiService;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  hasComments = (filmId) => this.#comments.has(filmId);

  loadComments = async (updateType, filmId) => {
    let comments = [];

    try {
      comments = await this.#apiService.getComments(filmId);

      this.#comments.set(filmId, comments.map(this.#adaptToClient));

    } catch (err) {
      throw new Error(`Can't load comment with fildId${filmId}`);
    }

    this._notify(updateType, { filmId });
  }

  getComments = (fildId) => {
    if (!this.hasComments(fildId)) {
      return [];
    }

    return this.#comments.get(fildId);
  }

  addComment = async (updateType, update) => {
    const { comment, fildId } = update;
    try {
      const { comments } = await this.#apiService.addComment(comment, fildId);

      const newComments = comments.map(this.#adaptToClient);

      this.#comments.set(fildId, newComments);

      this._notify(updateType, { fildId });

    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const { comment, fildId } = update;

    const comments = this.getComments(fildId);

    if (!comments) {
      throw new Error('Can\'t delete comments for film');
    }

    const index = comments.findIndex((item) => item.id === comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(comment);

      const newComments = [
        ...comments.slice(0, index),
        ...comments.slice(index + 1),
      ];

      this.#comments.set(fildId, newComments);

      this._notify(updateType, { idFilm: fildId });

    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      emoji: comment.emotion,
      text: comment.comment,
      day: new Date(comment.date),
    };

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];
    delete adaptedComment['date'];

    return adaptedComment;
  }
}
