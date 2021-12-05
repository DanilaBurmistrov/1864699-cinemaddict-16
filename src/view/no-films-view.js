import { createElement } from '../render';


const createEmptyTemplate = () => (
  `<section class="films-list">
            <h2 class="films-list__title"><h2 class="films-list__title">There are no movies in our database</h2></h2>
          </section>`
);

export default class NoFilmsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEmptyTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
