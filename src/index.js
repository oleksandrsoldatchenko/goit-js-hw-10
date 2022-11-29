// Імпорт стилей, бібліотек і функцію fetchCountries(name) з окремого файла, яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

// Константа прийому Debounce на обробнику події і HTTP-запит через 300мс після того, як користувач перестав вводити текст
const DEBOUNCE_DELAY = 300;

// Запис змінних через ref для скорочення коду
const refs = {
    input: document.querySelector('#search-box'),
    countriesList: document.querySelector('.country-list'),
    countriesInfo: document.querySelector('.country-info'),
};

// Слухач подій на input із debounce для реалізації затримки обробнику події і HTTP-запит
refs.input.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));

// Функція що приймає значення для слухача подій
function onInputValue(event) {

  // Санітизація введеного рядка методом trim(), для вирішиння проблеми, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.
  const inputValue = event.target.value.trim();

  // Умова не виведення результатів пошушку у разі відсутності введених даних
  if (inputValue === '') {
    refs.countriesList.innerHTML = '';
    refs.countriesInfo.innerHTML = '';
    return;
  }

  // Проміс із функції зовнішного файлу
  fetchCountries(inputValue)
    // Метод на випадок успіху
    .then(countriesListCreate)
    // Метод на випадок помилки
    .catch(countriesListError);
};

// Функція обробки успішного промісу
function countriesListCreate(countries) {
  // Змінна що виводить кількість знайдених країн по введеним в input літерам
  const countriesCount = countries.length;

  // Перевірка і повіщення Notiflix у разі кількості знайдених країн більше 10
  if (countriesCount > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    refs.countriesList.innerHTML = '';
    refs.countriesInfo.innerHTML = '';
    return;
  }

  // Оповіщення Notiflix у разі кількості знайдених країн більше 10
  if (countries.length > 1 && countries.length <= 10) {
    const listCountries = countries
      .map(country => countriesList(country))
      .join('');
    refs.countriesList.innerHTML = listCountries;
    refs.countriesInfo.innerHTML = '';
  }

  // Единий збіг з масиву обнуляє список і вкладає інформацію єдиного збіга в картку
  if (countries.length === 1) {
    const cardCountry = countries.map(country => countryСard(country)).join('');
    refs.countriesInfo.innerHTML = cardCountry;
    refs.countriesList.innerHTML = '';
  }
};

// Функція, що виводить оповіщення через Notiflix у разі відсутності збігу, помилку зі статус кодом 404 - не знайдено
function countriesListError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  refs.countriesList.innerHTML = '';
  refs.countriesInfo.innerHTML = '';
  return error;
};

// Функція, що доповнює ul liшками з зображенням флагу і офіційною назвою країн
function countriesList({ flags, name }) {
    return `
        <li class="country-list__item">
            <img " src="${flags.svg}" alt="${name.official}" width="25" />
            <h3>${name.official}</h3>
        </li>
    `;
};

// Функція, що доповнює div інформацією по країні в разі єдиного збігу по пошуку - розкриває картку країни
function countryСard({ flags, name, capital, population, languages }) {
    return `
        <div class="country-info">
            <div class="country-info__box">
                <img src="${flags.svg}" alt="${name.official}" width="50" />
                <h3 class="country-info__country-name">${name.official}</h3>
            </div>
            <p><b><i>Capital:</i></b>${capital}</p>
            <p><b><i>Population:</i></b>${population}</p>
            <p><b><i>Languages:</i></b>${Object.values(languages)}</p>
        </div>
    `;
};