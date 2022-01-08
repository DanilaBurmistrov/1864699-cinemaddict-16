import FilmStatisticsView from './view/film-statistics-view.js';
import FilmCardPresenter from './presenter/film-card-presenter.js';
import {generateFilmInfo} from './mock/films-info';
import {generateFilters} from './mock/navigation.js';
import MenuNavigationView from './view/menu-navigation-view.js';
import {render} from './render.js';
import UserRatingView from './view/user-rating-view.js';


const CARD_COUNT = 15;

const films = Array.from({length: CARD_COUNT}, generateFilmInfo);
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

render(siteHeader, new UserRatingView());
render(siteFooterStatistics, new FilmStatisticsView());

const filters = generateFilters(films);
render(siteMainElement, new MenuNavigationView(filters));

const filmListPresenter = new FilmCardPresenter(siteMainElement);
filmListPresenter.init(films);

