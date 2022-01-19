import AbstractView from './abstract-view';

export const createMostCommentedTemplate = () => (
  `<section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container">
      </div>
  </section>`
);

export default class FilmsExtraMostCommentedView extends AbstractView {

  get template() {
    return createMostCommentedTemplate();
  }

}
