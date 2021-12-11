import FilmListView from './view/film-list-view.js';
import FilmCardView from './view/film-card-view.js';
import FilmPopupView from './view/film-popup-view.js';
import FilmStatisticsView from './view/film-statistics-view.js';
import {generateFilmInfo} from './mock/card-films.js';
import {generateFilters} from './mock/navigation.js';
import MenuNavigationView from './view/menu-navigation-view.js';
import NoFilmsView from './view/no-films-view.js';
import {render,
  RenderPosition,
  remove} from './render.js';
import ShowButtonView from './view/show-button-view.js';
import SortView from './view/sort-view.js';
import UserRatingView from './view/user-rating-view.js';


const CARD_COUNT = 15;
const FILM_CARDS_COUNT_INLINE = 5;
const filmCards = new Array(CARD_COUNT).fill().map(generateFilmInfo);
const filters = generateFilters(filmCards);

const films = Array.from({length: CARD_COUNT}, generateFilmInfo);
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooter = document.querySelector('.footer');
const siteFooterStatistics = siteFooter.querySelector('.footer__statistics');
const menuNavigationComponent = new MenuNavigationView(filters);
const filmStatisticsComponent = new FilmStatisticsView();
const userRatingComponent = new UserRatingView();
const sortComponent = new SortView();
const filmListComponent = new FilmListView();

render(siteMainElement, menuNavigationComponent, RenderPosition.BEFOREEND);
render(siteFooterStatistics, filmStatisticsComponent, RenderPosition.BEFOREEND);
render(siteHeader, userRatingComponent, RenderPosition.BEFOREEND);
render(siteMainElement, sortComponent, RenderPosition.BEFOREEND);
render(siteMainElement, filmListComponent, RenderPosition.BEFOREEND);

const filmListContainer = siteMainElement.querySelector('.films-list__container');

const renderFilmCard = (container, film) => {
  const filmCardComponent = new FilmCardView(film);

  render(container, filmCardComponent, RenderPosition.BEFOREEND);

  const popupComponent = new FilmPopupView(film);

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      container.removeChild(popupComponent.element);
      document.removeEventListener('keydown', onEscKeyDown);
      container.classList.remove('hide-overflow');
    }
  };

  filmCardComponent.setCardClickHandler(() => {
    container.appendChild(popupComponent.element);
    document.addEventListener('keydown', onEscKeyDown);
    container.classList.add('hide-overflow');
  });

  popupComponent.setCloseButtonClickHandler(() => {
    container.removeChild(popupComponent.element);
    document.removeEventListener('keydown', onEscKeyDown);
    container.classList.remove('hide-overflow');
  });
};

const noFilmsComponent = new NoFilmsView();
const showButtonComponent = new ShowButtonView();

if (films.length === 0) {

  render(filmListContainer, noFilmsComponent, RenderPosition.BEFOREEND);

} else {
  for (let i = 0; i < FILM_CARDS_COUNT_INLINE; i++) {
    renderFilmCard(filmListContainer, films[i]);
  }

  const siteFilmList = siteMainElement.querySelector('.films-list');

  if (films.length > FILM_CARDS_COUNT_INLINE) {
    let renderedFilmCount = FILM_CARDS_COUNT_INLINE;

    render(siteFilmList, showButtonComponent, RenderPosition.BEFOREEND);

    const loadMoreButton = siteFilmList.querySelector('.films-list__show-more');

    loadMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_CARDS_COUNT_INLINE)
        .forEach((film) => renderFilmCard(filmListContainer, film));
      renderedFilmCount += FILM_CARDS_COUNT_INLINE;

      if (renderedFilmCount >= films.length) {
        remove(showButtonComponent);
      }
    });
  }
}
