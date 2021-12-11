import AbstractView from './abstract-view';

const createShowButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowButtonView extends AbstractView {

  get template() {
    return createShowButtonTemplate();
  }
}
