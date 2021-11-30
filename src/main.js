import {createMenuItemTemplate,
  createSiteStatistics} from './view/menu-navigation-stats-view.js';
import {renderTemplate,
  RenderPosition} from './render.js';
import {createFilmCardTemplate,
  createFilmListTemplate} from './view/film-card-view.js';
import {createUserRatingTemplate} from './view/user-rating-view.js';
import {createShowButtomTemplate} from './view/show-button-view.js';
import {createFilmDetailsTemplate} from './view/film-popup-view.js';
import {generateFilmInfo} from './mock/card-films.js';
import { createSortTemplate } from './view/sort.js';
import { generateFilters } from './mock/navigation.js';

const CARD_COUNT = 15;
const FILM_CARDS_COUNT_INLINE = 5;
const filmCards = new Array(CARD_COUNT).fill().map(generateFilmInfo);
const filters = generateFilters(filmCards);

const films = Array.from({length: CARD_COUNT}, generateFilmInfo);
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');
const siteBodyElement = document.querySelector('body');

renderTemplate(siteMainElement, createMenuItemTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(siteFooterStatistics, createSiteStatistics(), RenderPosition.BEFOREEND);
renderTemplate(siteHeader, createUserRatingTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createFilmListTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);

const filmsBoardElement = siteMainElement.querySelector('.films');

renderTemplate(filmsBoardElement, createFilmListTemplate(), RenderPosition.BEFOREEND);


const filmListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < FILM_CARDS_COUNT_INLINE; i++) {
  renderTemplate(filmListContainer, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

const siteFilmList = siteMainElement.querySelector('.films-list');

renderTemplate(siteBodyElement, createFilmDetailsTemplate(films[0]), RenderPosition.BEFOREEND);
if (films.length > FILM_CARDS_COUNT_INLINE) {
  let renderedFilmCount = FILM_CARDS_COUNT_INLINE;

  renderTemplate(siteFilmList, createShowButtomTemplate(), RenderPosition.BEFOREEND);

  const loadMoreButton = siteFilmList.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_CARDS_COUNT_INLINE)
      .forEach((film) => renderTemplate(filmListContainer, generateFilmInfo(film), RenderPosition.BEFOREEND));
    renderedFilmCount += FILM_CARDS_COUNT_INLINE;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

// Временное решение
const popupElement = siteBodyElement.querySelector('.film-details');
popupElement.style.display = 'none';

