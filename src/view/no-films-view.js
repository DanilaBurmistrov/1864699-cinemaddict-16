import AbstractView from './abstract-view';


const createEmptyTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
   </section>`
);

export default class NoFilmsView extends AbstractView {

  get template() {
    return createEmptyTemplate();
  }
}
