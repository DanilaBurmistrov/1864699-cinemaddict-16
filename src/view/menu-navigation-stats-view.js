export const createSiteStatistics = () => (
  `<section class="footer__statistics">
  <p>130 291 movies inside</p>
</section>`
);

const createFilter = (filter) => `<a href="#${filter.name}" class="main-navigation__item">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;

export const createMenuItemTemplate = (filters) => {
  const currentFilters = filters.reduce((total,current) => total + createFilter(current), '');
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${currentFilters}
    </div>
    </nav>`;
};
