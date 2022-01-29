import AbstractObservable from '../utils/abstract-observable.js';
import {FilterType, MenuItem} from '../constants';

export default class FilterModel extends AbstractObservable {
  #filter = FilterType.ALL;
  #menuType = MenuItem.FILMS;

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
  }

  get menuType() {
    return this.#menuType;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

  setMenuType = (menuType) => {
    this.#menuType = menuType;
  }
}
