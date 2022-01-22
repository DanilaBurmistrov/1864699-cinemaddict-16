import AbstractView from './view/abstract-view';

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

export const render = (container, element, place) => {

  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      parent.before(child);
      break;
    case RenderPosition.AFTERBEGIN:
      parent.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      parent.append(child);
      break;
    case RenderPosition.AFTEREND:
      parent.after(child);
      break;
    default:
      parent.append(child);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Function "remove" can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

export const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

export const KeysName = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  CTRL: 'Ctrl'
};

export const FilmActionType = {
  ADD_WATCH_LIST: 'watchList',
  MARK_WATCHED: 'watched',
  MARK_FAVORITE: 'favorite',
};

export const FilmListNames = {
  ALL_FILMS: 'allFilms',
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};

export const SortTypes = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const FilterType = {
  ALL: 'all',
  WATCH_LIST: 'watchList',
  WATCHED: 'watched',
  FAVORITES: 'favorites',
};

export const filter = {
  [FilterType.ALL]: (filmsList) => [...filmsList],
  [FilterType.WATCH_LIST]: (filmsList) => filmsList.filter((film) => film.isInWatchList),
  [FilterType.WATCHED]: (filmsList) => filmsList.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (filmsList) => filmsList.filter((film) => film.isFavorite),
};

export const CommentAction = {
  ADD: 'add',
  DELETE: 'delete',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
