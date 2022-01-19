import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  _data = {};
  _commentsData = [];

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateData = (update, justDataUpdating) => {
    if(!update) {
      return;
    }
    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateCommentsData = (update) => {
    if(!update) {
      return;
    }
    this._commentsData = [...this._commentsData, {...update}];

    this.updateElement();
  }

}
