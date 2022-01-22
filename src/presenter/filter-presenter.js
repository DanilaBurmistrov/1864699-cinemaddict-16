import MenuFilterView from '../view/menu-filter-view.js';
import {render, replace, remove} from '../render.js';
import { filter } from '../render.js';
import {FilterType, UpdateType} from '../render.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
  }

  get filters() {
    const filmsList = this.#filmsModel.filmsList;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: null,
      },
      {
        type: FilterType.WATCH_LIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCH_LIST](filmsList).length,
      },
      {
        type: FilterType.WATCHED,
        name: 'History',
        count: filter[FilterType.WATCHED](filmsList).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](filmsList).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new MenuFilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
