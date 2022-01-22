import CommentsModel from './model/comments-model.js';
import FilmStatisticsView from './view/film-statistics-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {generateFilmInfo} from './mock/films-info';
import { generateComments } from './mock/films-info';
import {render} from './render.js';
import UserRatingView from './view/user-rating-view.js';

const CARD_COUNT = 15;

const films = Array.from({length: CARD_COUNT}, generateFilmInfo);
const comments = generateComments(films);
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

render(siteHeader, new UserRatingView());
render(siteFooterStatistics, new FilmStatisticsView());

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const filmsModel = new FilmsModel(commentsModel);
filmsModel.filmsList = films;

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

filterPresenter.init();
filmListPresenter.init();

