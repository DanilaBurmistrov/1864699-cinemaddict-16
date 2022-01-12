import AbstractView from './abstract-view';

const createFilmsListTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsView extends AbstractView {

  get template() {

    return createFilmsListTemplate();
  }
}
