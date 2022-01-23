import AbstractView from './abstract-view';

export const createMostCommentedTemplate = () => (
  `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
  </section>`
);

export default class FilmsExtraMostCommentedView extends AbstractView {
  #filmsExtraMostCommentedContainer = null;

  get filmsExtraMostCommentedContainer() {
    if(!this.#filmsExtraMostCommentedContainer) {
      this.#filmsExtraMostCommentedContainer = this.element.querySelector('.films-list__container');
    }
    return this.#filmsExtraMostCommentedContainer;
  }

  get template() {
    return createMostCommentedTemplate();
  }

}
