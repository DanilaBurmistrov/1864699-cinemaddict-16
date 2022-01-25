import AbstractView from './abstract-view';
import { MenuItem } from '../constants';

const createCountElement = (count = null) => count ? ` <span class="main-navigation__item-count">${count}</span>` : '';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, name, count} = filter;
  const countElement = createCountElement(count);

  return (
    `<a href="#${name.toLowerCase()}"
        id="filter__${name}"
        data-filter-type="${type}"
        class="main-navigation__item${type === currentFilter ? ' main-navigation__item--active' : ''}">${name}${countElement}</a>`
  );
};

const createFilterTemplate = (filterItems, currentFilter, menuType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional${menuType === MenuItem.STATISTICS ?' main-navigation__additional--active' : ''}">Stats</a>
  </nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #menuType = null;

  constructor(filters, currentFilterType, menuType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#menuType = menuType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter, this.#menuType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', (evt) => {
        this.#filterTypeChangeHandler(evt);
      });
    });
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  #menuStatisticClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATISTICS);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#menuStatisticClickHandler);
  }
}
