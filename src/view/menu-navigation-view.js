import { createElement } from '../render';

const createFilter = (filter) => `<a href="#${filter.name}" class="main-navigation__item">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;

const createMenuItemTemplate = (filters) => {
  const currentFilters = filters.reduce((total,current) => total + createFilter(current), '');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${currentFilters}
    </div>
    </nav>`;
};

export default class FilmNavigationView {
  #element = null;
  #filters = null;

  constructor(filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMenuItemTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
