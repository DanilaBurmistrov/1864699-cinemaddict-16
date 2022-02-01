import CommentsModel from './model/comments-model.js';
import FilmStatisticsView from './view/film-statistics-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { MenuItem } from './constants.js';
import {render, remove} from './render.js';
import StatisticsView from './view/statistics-view.js';
import UserRatingView from './view/user-rating-view.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic 3zwxrtcyvubinjomkl';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const apiService = new ApiService(END_POINT, AUTHORIZATION);
const commentsModel = new CommentsModel(apiService);
const filmsModel = new FilmsModel(apiService, commentsModel);

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');

render(siteHeader, new UserRatingView(filmsModel));
render(siteFooterStatistics, new FilmStatisticsView(filmsModel.filmsList.length));

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, commentsModel, filterModel);

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticsComponent);
      filmListPresenter.init();
      break;
    case MenuItem.STATISTICS:
      filmListPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.filmsList);
      render(siteMainElement, statisticsComponent);
      break;
  }
};

filterPresenter.init();
filmListPresenter.init();

filmsModel.init().finally(() => {
  filterPresenter.setMenuClickHandler(handleSiteMenuClick);
});


