import AbstractView from './abstract-view';
import { SortTypes } from '../constants';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
  <li><a href="#" class="sort__button ${currentSortType === SortTypes.DEFAULT ? 'sort__button--active' : ''}" data-sort-type=${SortTypes.DEFAULT}>Sort by default</a></li>
  <li><a href="#" class="sort__button ${currentSortType === SortTypes.DATE ? 'sort__button--active' : ''}" data-sort-type=${SortTypes.DATE}>Sort by date</a></li>
  <li><a href="#" class="sort__button ${currentSortType === SortTypes.RATING ? 'sort__button--active' : ''}" data-sort-type=${SortTypes.RATING}>Sort by rating</a></li>
</ul>`);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType = null) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#handleActiveClassChange(evt);
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  #handleActiveClassChange = (evt) => {
    const allSortButtons = document.querySelectorAll('.sort__button');
    allSortButtons.forEach((element) => {
      element.classList.remove('sort__button--active');
    });
    evt.target.classList.add('sort__button--active');
  }
}
