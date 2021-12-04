import FilmNavigationView from './view/menu-navigation-view.js';
import FilmCardView from './view/film-card-view.js';
import ShowButtonView from './view/show-button-view.js';
import FilmPopupView from './view/film-popup-view.js';
import SortView from './view/sort-view.js';
import SiteStatsView from './view/film-statistics-view.js';
import UserRatingView from './view/user-rating-view.js';
import FilmListView from './view/film-list-view.js';

import {renderElement,
  RenderPosition} from './render.js';
import {generateFilmInfo} from './mock/card-films.js';
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

renderElement(siteMainElement, new FilmNavigationView(filters).element, RenderPosition.BEFOREEND);
renderElement(siteFooterStatistics, new SiteStatsView().element, RenderPosition.BEFOREEND);
renderElement(siteHeader, new UserRatingView().element, RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().element, RenderPosition.BEFOREEND);
renderElement(siteMainElement, new FilmListView().element, RenderPosition.BEFOREEND);

const filmListContainer = siteMainElement.querySelector('.films-list__container');

const renderFilmCard = (container, film) => {
  const filmCardComponent = new FilmCardView(film);
  renderElement(container, filmCardComponent.element, RenderPosition.BEFOREEND);

  const popupComponent = new FilmPopupView(film);

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      container.removeChild(popupComponent.element);
      document.removeEventListener('keydown', onEscKeyDown);
      container.classList.remove('hide-overflow');
    }
  };

  filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', (evt) => {
    evt.preventDefault();
    container.appendChild(popupComponent.element);
    document.addEventListener('keydown', onEscKeyDown);
    container.classList.add('hide-overflow');
  });

  popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    container.removeChild(popupComponent.element);
    document.removeEventListener('keydown', onEscKeyDown);
    container.classList.remove('hide-overflow');
  });
};


for (let i = 0; i < FILM_CARDS_COUNT_INLINE; i++) {
  renderFilmCard(filmListContainer, films[i]);
}

const siteFilmList = siteMainElement.querySelector('.films-list');

if (films.length > FILM_CARDS_COUNT_INLINE) {
  let renderedFilmCount = FILM_CARDS_COUNT_INLINE;

  renderElement(siteFilmList, new ShowButtonView().element, RenderPosition.BEFOREEND);

  const loadMoreButton = siteFilmList.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_CARDS_COUNT_INLINE)
      .forEach((film) => renderFilmCard(filmListContainer, film));
    renderedFilmCount += FILM_CARDS_COUNT_INLINE;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}
