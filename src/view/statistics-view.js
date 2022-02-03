import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view.js';
import {
  getGenresWithCountFromFilmsList,
  sortGenreCountDown,
  getTotalDuration,
  getFilmsListFilteredByTime
} from '../utils/statistics.js';
import { StatisticsType } from '../constants';
import { MINUTES_IN_HOURS } from '../constants.js';
import { getDisplayRating } from '../utils/common.js';

const BAR_HEIGHT = 50;
const BAR_THICKNESS = 24;
const SIZE = 20;
const OFFSET = 40;
const PADDING = 100;
const FONT_SIZE = 20;
const Colors = {
  WHITE: '#ffffff',
  YELLOW: '#ffe800',
};

const renderChart = (statisticCtx, filmsList, statisticsType) => {
  const filteredFilmsList = getFilmsListFilteredByTime(statisticsType, filmsList);
  const filmGenresWithCount = getGenresWithCountFromFilmsList(filteredFilmsList);
  const sortedFilmGenres = filmGenresWithCount.sort(sortGenreCountDown);
  const filmGenres = sortedFilmGenres.map((genre) => genre.genre);
  const filmsByGenreCounts = sortedFilmGenres.map((genre) => genre.count);

  statisticCtx.height = BAR_HEIGHT * filmsByGenreCounts.length;

  return  new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: filmGenres,
      datasets: [{
        data: filmsByGenreCounts,
        backgroundColor: Colors.YELLOW,
        hoverBackgroundColor: Colors.YELLOW,
        anchor: 'start',
        barThickness: BAR_THICKNESS,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: SIZE,
          },
          color: Colors.WHITE,
          anchor: 'start',
          align: 'start',
          offset: OFFSET,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Colors.WHITE,
            padding: PADDING,
            fontSize: FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (data) => {
  const {filmsList, statisticsType} = data;
  const checkedStatisticsType = (type) => type === statisticsType ? ' checked="checked"' : '';
  const filteredFilmsList = getFilmsListFilteredByTime(statisticsType, filmsList);
  const filmsWatched = filteredFilmsList.length;
  const filmsCount = filmsList.length;

  let totalDuration = 0;
  let totalDurationHourse = 0;
  let totalDurationMinutes = 0;
  let topGenre = null;

  if(filmsWatched) {
    totalDuration = getTotalDuration(filteredFilmsList);
    totalDurationHourse =  Math.trunc(totalDuration / MINUTES_IN_HOURS);
    totalDurationMinutes = totalDuration % MINUTES_IN_HOURS;
    const filmGenresWithCount = getGenresWithCountFromFilmsList(filteredFilmsList);
    const sortedFilmGenres = filmGenresWithCount.sort(sortGenreCountDown);
    topGenre = sortedFilmGenres.length ? sortedFilmGenres[0].genre : null;
  }

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getDisplayRating(filmsCount)}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time"
        value="${StatisticsType.ALL}"${checkedStatisticsType(StatisticsType.ALL)}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today"
        value="${StatisticsType.TODAY}"${checkedStatisticsType(StatisticsType.TODAY)}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week"
        value="${StatisticsType.WEEK}"${checkedStatisticsType(StatisticsType.WEEK)}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month"
        value="${StatisticsType.MONTH}"${checkedStatisticsType(StatisticsType.MONTH)}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year"
        value="${StatisticsType.YEAR}"${checkedStatisticsType(StatisticsType.YEAR)}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsWatched} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDurationHourse} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
      </li>
    </ul>
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class StatisticsView extends SmartView {
  #chart = null;
  #statisticsType = StatisticsType.ALL;

  constructor(filmsList) {
    super();

    this._data = {
      filmsList,
      statisticsType: this.#statisticsType
    };

    this.#setCharts();
    this.#setTimeChange();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
    }
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setTimeChange();
  }

  #setTimeChange = () => {
    this.element.querySelectorAll('.statistic__filters-input').forEach((input) => {
      input.addEventListener('click', this.#inputChangeHandler);
    });
  }

  #inputChangeHandler = (evt) => {
    evt.preventDefault();
    const statisticsType = evt.target.value;

    if(statisticsType === this.#statisticsType){
      return;
    }

    this.#statisticsType = statisticsType;
    this.updateData({statisticsType: this.#statisticsType});
  }

  #setCharts = () => {
    const {filmsList, statisticsType} = this._data;
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderChart(statisticCtx, filmsList, statisticsType);
  }
}
