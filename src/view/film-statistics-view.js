import AbstractView from './abstract-view';

const createSiteStatistics = () => (
  `<section class="footer__statistics">
  <p>130 291 movies inside</p>
</section>`
);

export default class FilmStatisticsView extends AbstractView {

  get template() {
    return createSiteStatistics();
  }
}
