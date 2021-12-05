import { createElement } from '../render';

const createSiteStatistics = () => (
  `<section class="footer__statistics">
  <p>130 291 movies inside</p>
</section>`
);

export default class FilmStatisticsView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteStatistics();
  }

  removeElement() {
    this.#element = null;
  }
}
