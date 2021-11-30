import { generateFilmInfo } from '../mock/card-films';

const addFilmStatusControls = (valueControls, template) => {
  if (valueControls) {
    return template;
  }
  return '';
};

export const createFilmCardTemplate = () => {
  const filmInfo = generateFilmInfo();
  const classControls = 'film-card__controls-item--active';
  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmInfo.releaseDate}</span>
      <span class="film-card__duration">${filmInfo.duration}</span>
      <span class="film-card__genre">${filmInfo.genre}</span>
    </p>
    <img src= ${filmInfo.poster} alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description}</p>
    <span class="film-card__comments">${filmInfo.comments}</span>
  </a>
  <div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addFilmStatusControls(filmInfo.watchList,classControls)}" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addFilmStatusControls(filmInfo.watched,classControls)}" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite ${addFilmStatusControls(filmInfo.favorite,classControls)}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export const createFilmListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`
);
