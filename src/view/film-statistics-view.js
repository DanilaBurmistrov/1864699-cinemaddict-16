import AbstractView from './abstract-view';

const createSiteStatistics = (filmsCount) => (
  `<p>${filmsCount} movies inside</p>`
);

export default class FilmStatisticsView extends AbstractView {
  #filmsCount = 0;
  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createSiteStatistics(this.#filmsCount);
  }
}
