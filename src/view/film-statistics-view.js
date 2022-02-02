import AbstractView from './abstract-view';

const FILMS_COUNT_LENGTH = 0;

const createSiteStatistics = (filmsCount) => (
  `<p>${filmsCount} movies inside</p>`
);

export default class FilmStatisticsView extends AbstractView {
  #filmsCount = FILMS_COUNT_LENGTH;
  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createSiteStatistics(this.#filmsCount);
  }
}
