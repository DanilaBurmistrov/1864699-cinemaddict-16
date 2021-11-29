import dayjs from 'dayjs';

const DESCRIPTION = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Cras aliquet varius magna, non porta ligula feugiat eget',
  'Fusce tristique felis at fermentum pharetra',
  'Aliquam id orci ut lectus varius viverra',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
  'Phasellus eros mauris',
  'condimentum sed nibh vitae, sodales efficitur ipsum',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
  'Sed sed nisi sed augue convallis suscipit in sed felis',
  'Aliquam erat volutpat',
  'Nunc fermentum tortor ac porta dapibus',
  'In rutrum ac purus sit amet tempus'];

function getRandomNumberInRange (min, max) {
  return Math.random() * (max - min + 1) + min;
}

function getRandomFloat(min, max, numberAfterComma) {
  return getRandomNumberInRange(min, max).toFixed(numberAfterComma);
}

function getRandomInteger(min, max) {
  return Math.floor(getRandomNumberInRange(min, max));
}

const generateTitle = () => {
  const titles = [
    'made for each other',
    'popeye meets sinbad',
    'sagebrush trail',
    'santa claus conquers the martians',
    'the dance of life',
    'the great flamarion',
    'the man with the golden arm'
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generatePoster = () => {
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateRaiting = () => {
  const raiting = getRandomFloat(1.0, 10.0, 1);
  return raiting;
};

const generateDate = () => {
  const maxDaysGap = 14600;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  return dayjs().add(daysGap, 'day').format('DD MMMM YYYY');
};

const generateDuration = () => {
  const hour = getRandomInteger(1, 4);
  const firstPartMinutes = getRandomInteger(0, 5);
  const secondPartMinutes = getRandomInteger(0, 9);

  return `${hour}h ${firstPartMinutes}${secondPartMinutes}m`;
};

const generateGenre = () => {
  const genres = ['Musical', 'Adventure', 'Horror', 'Western', 'Action'];

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

const generateCommentsAmount = () => {
  const comments = getRandomInteger(0, 5);
  return comments;
};

const generateDescription = (transmittedArray) => {
  const maxLength = 5;
  const lengthOfArray = getRandomInteger(1, maxLength);
  const array = [];

  while (array.length < lengthOfArray) {
    const indexOfElement = getRandomInteger(0, maxLength - 1);
    const element = transmittedArray[indexOfElement];

    if (!array.includes(element)) {
      array.push(element);
    }
  }
  return array;
};

const generateAge = () => {
  const age = getRandomInteger(0, 18);
  return age;
};

export const generateFilmPopup = () => ({
  poster: generatePoster(),
  title: generateTitle(),
  rating: generateRaiting(),
  releaseDate: generateDate(),
  duration: generateDuration(),
  genre: generateGenre(),
  description: generateDescription(DESCRIPTION),
  comments: generateCommentsAmount(),
  age: generateAge(),
});
