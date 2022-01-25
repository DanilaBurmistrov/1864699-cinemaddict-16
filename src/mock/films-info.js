import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

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

const getRandomNumberInRange = (min, max) => Math.random() * (max - min + 1) + min;

const getRandomInteger = (min, max) => Math.floor(getRandomNumberInRange(min, max));

export const getRandomFloat = (min = 0.0, max = 1.0, numberDecimals = 1) => {
  const randomValue = Math.random() * (max - min + 1) + min;

  return Number(randomValue.toFixed(numberDecimals));
};

export const getRandomBoolean = () => Boolean(getRandomInteger(0, 1));

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
  const raiting = getRandomFloat(0.0, 10.0);
  return raiting;
};

const generateDate = () => {
  const maxDaysGap = 14600;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  return dayjs().add(daysGap, 'day').format('DD MMMM YYYY');
};

const generateDuration = () => {
  const MIN_TIME_IN_MINUTES = 30;
  const MAX_TIME_IN_MINUTES = 180;
  const totalMinutes = getRandomInteger(MIN_TIME_IN_MINUTES, MAX_TIME_IN_MINUTES);
  return totalMinutes;
};

const generateRandomArrayOfArray = (transmittedArray) => {
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

const getRandomElementOfArray = (randomElement) => {
  const calculatedElement = randomElement[Math.floor(Math.random() * randomElement.length)];
  return calculatedElement;
};

const generateGenres = () => {
  const GENRES = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Mystery',
  ];
  return generateRandomArrayOfArray(GENRES);
};

const generateAge = () => {
  const age = getRandomInteger(0, 18);
  return age;
};

const generateDirector = () => {
  const DIRECTORS = [
    'David Lynch',
    'Martin Scorsese',
    'Joel and Ethan Coen',
    'Steven Soderbergh',
    'Terrence Malick',
    'Abbas Kiarostami',
    'Errol Morris',
  ];
  return getRandomElementOfArray(DIRECTORS);
};

const generateWriters = () => {
  const WRITERS = [
    'William Goldman',
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
    'George Lucas',
    'Eric Roth',
    'Chang-dong Lee',
    'Richard Linklater',
    'Lars von Trier',
    'Quentin Tarantino'
  ];
  return getRandomElementOfArray(WRITERS);
};

const generateActors = () => {
  const ACTORS = [
    'William Goldman',
    'Anne Wigton',
    'Heinz Herald',
    'Dan Duryea',
    'Robert De Niro',
    'Jack Nicholson',
    'Marlon Brando',
    'Denzel Washington',
    'Katharine Hepburn',
    'Humphrey Bogart',
    'Meryl Streep',
  ];
  return generateRandomArrayOfArray(ACTORS);
};

const generateCountry = () => {
  const COUNTRIES = [
    'Russia',
    'USA',
    'Germany',
    'Australia',
    'Poland',
    'Italy',
    'Finland',
    'India',
  ];
  return getRandomElementOfArray(COUNTRIES);
};

const generateEmoji = () => {
  const EMOJIS = [
    './images/emoji/angry.png',
    './images/emoji/puke.png',
    './images/emoji/sleeping.png',
    './images/emoji/smile.png'
  ];
  return getRandomElementOfArray(EMOJIS);
};

const generateCommentText = () => {
  const TEXTS = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?'
  ];
  return getRandomElementOfArray(TEXTS);
};

const generateCommentAuthor = () => {
  const AUTHORS = [
    'Tim Macoveev',
    'John Doe',
    'Ivan Petrov',
    'Den Ivanov',
    'Kirill Sidorov',
  ];
  return getRandomElementOfArray(AUTHORS);
};

const generateCommentDay = () => {
  const daysGap = getRandomInteger(-90, 0);

  return dayjs().add(daysGap, 'day');
};

const generateComment = () => ({
  emoji: generateEmoji(),
  text: generateCommentText(),
  author: generateCommentAuthor(),
  day: generateCommentDay(),
});

export const generateComments = () => {
  const commentCount = getRandomInteger(0, 5);
  return Array.from({length: commentCount}, generateComment);
};

const generateYear = () => getRandomInteger(1950, 2021);

const generateWatchingDate = (isWatched = true) => {
  if(isWatched) {
    const MAX_WATCHING_DAYS_GAP = 20;
    const daysGap = getRandomInteger(-MAX_WATCHING_DAYS_GAP, 0);

    return dayjs().add(daysGap, 'day');
  }
  return null;
};

export const generateFilmInfo = () => {
  const isWatched = getRandomBoolean();
  return {
    id: nanoid(),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    countries: generateCountry(),
    poster: generatePoster(),
    title: generateTitle(),
    rating: generateRaiting(),
    releaseDate: generateDate(),
    duration: generateDuration(),
    genres: generateGenres(),
    description: generateRandomArrayOfArray(DESCRIPTION),
    age: generateAge(),
    isWatched: Boolean(getRandomInteger(0,1)),
    isFavorite: Boolean(getRandomInteger(0,1)),
    isInWatchList: Boolean(getRandomInteger(0,1)),
    comments: generateComments(),
    year: generateYear(),
    watchingDate:  generateWatchingDate(isWatched),
  };
};
