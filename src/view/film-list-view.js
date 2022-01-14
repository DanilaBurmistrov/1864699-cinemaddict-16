import AbstractView from './abstract-view';

const createFilmsListTemplate = (title, isExtra) => {
  const extraClass = isExtra ? ' films-list--extra' : '';
  const additionalTitleClass = isExtra ? '' : ' visually-hidden';
  return `<section class="films-list${extraClass}">
    <h2 class="films-list__title${additionalTitleClass}">${title}</h2>
    <div class="films-list__container">
    </div>
  </section>`;
};

export default class FilmsListView extends AbstractView {
  #title = null;
  #isExtra = false;
  #filmsListContainer = null;

  constructor(title, isExtra) {
    super();
    this.#title = title;
    this.#isExtra = isExtra;
  }

  get filmsListContainer() {
    if(!this.#filmsListContainer) {
      this.#filmsListContainer = this.element.querySelector('.films-list__container');
    }
    return this.#filmsListContainer;
  }

  get template() {
    return createFilmsListTemplate(this.#title, this.#isExtra);
  }
}
