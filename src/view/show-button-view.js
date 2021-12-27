import AbstractView from './abstract-view';

const createShowButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowButtonView extends AbstractView {

  get template() {
    return createShowButtonTemplate();
  }

setClickHandler = (callback) => {
  this._callback.click = callback;
  this.element.addEventListener('click', this.#clickHandler);
}

#clickHandler = (evt) => {
  evt.preventDefault();
  this._callback.click();
}
}
