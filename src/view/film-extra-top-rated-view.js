import AbstractView from './abstract-view';

export const createTopRatedTemplate = () => (
  `<section class="films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsExtraTopRatedView extends AbstractView {
  #filmsExtraTopRatedContainer = null;

  get filmsExtraTopRatedContainer() {
    if(!this.#filmsExtraTopRatedContainer) {
      this.#filmsExtraTopRatedContainer = this.element.querySelector('.films-list__container');
    }
    return this.#filmsExtraTopRatedContainer;
  }

  get template() {
    return createTopRatedTemplate();
  }
}
