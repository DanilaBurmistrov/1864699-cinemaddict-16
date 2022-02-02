import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  _data = {};
  #scrollLeft = null;
  #scrollTop = null;

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.saveScroll();

    this.removeElement();
    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
    this.#restoreSavedScroll();
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

  saveScroll = () => {
    this.#scrollLeft = this.element.scrollLeft;
    this.#scrollTop = this.element.scrollTop;
  }

  setScroll = (scrollOptions) => {
    this.element.scrollTo(scrollOptions);
  }

  #restoreSavedScroll = () => {
    if(this.#scrollLeft !== null && this.#scrollTop !== null) {
      this.element.scrollTo(this.#scrollLeft, this.#scrollTop);
    }
  }

  get scrollOptions(){
    return {
      top: this.#scrollTop ? this.#scrollTop : 0,
      left: this.#scrollLeft ? this.#scrollLeft : 0
    };
  }

}
