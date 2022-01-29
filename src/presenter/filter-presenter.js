import MenuFilterView from '../view/menu-filter-view.js';
import {render, replace, remove} from '../render.js';
import { filter } from '../constants';
import {FilterType, UpdateType, MenuItem} from '../constants';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;
  #changeMenuType = null;

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
    const currentFilter = this.#filterModel.menuType === MenuItem.FILMS ? this.#filterModel.filter : null;

    this.#filterComponent = new MenuFilterView(filters, currentFilter, this.#filterModel.menuType);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setMenuClickHandler(this.#handleChangeMenu);

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
    if(this.#filterModel.menuType === MenuItem.STATISTICS) {
      this.#handleChangeMenu(MenuItem.FILMS);
    }
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  setMenuClickHandler = (callback) => {
    this.#changeMenuType = callback;
  }

  #handleChangeMenu = (menuType) => {
    if (this.#filterModel.menuType === menuType) {
      return;
    }

    this.#filterModel.filter = FilterType.ALL;
    this.#filterModel.setMenuType(menuType);
    this.#changeMenuType(this.#filterModel.menuType);

    this.init();
  }
}
