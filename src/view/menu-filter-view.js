import AbstractView from './abstract-view';

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

const createFilterTemplate = (filterItems, currentFilter) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join('');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MenuFilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
