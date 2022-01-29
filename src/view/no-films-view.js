import AbstractView from './abstract-view';
import { FilterType } from '../constants';

const noFilmsTexts = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCH_LIST]: 'There are no movies to watch now',
  [FilterType.WATCHED]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyTemplate = (filterType) => (
  `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">${noFilmsTexts[filterType]}</h2>
  </section>
</section>`
);

export default class NoFilmsView extends AbstractView {

  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createEmptyTemplate(this._data);
  }
}
