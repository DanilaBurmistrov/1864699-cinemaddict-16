import {createSiteMenuTemplate, createSiteStatistics} from './view/menu-navigation-stats-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createUserRatingTemplate} from './view/user-rating-view.js';
import {createShowButtomTemplate} from './view/show-button-view.js';
import {createFilmDetailsTemplate} from './view/film-popup-view.js';

const CARD_COUNT = 5;

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');
const siteFilmList = siteMainElement.querySelector('.films-list');

renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFooterStatistics, createSiteStatistics(), RenderPosition.BEFOREEND);
renderTemplate(siteHeader, createUserRatingTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFilmList, createShowButtomTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFooter, createFilmDetailsTemplate(), RenderPosition.AFTEREND);

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(siteMainElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}
