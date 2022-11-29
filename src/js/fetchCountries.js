// Функція, що робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту
export function fetchCountries(name) {
  // посилання на ресурс бекенду
  const libUrl = 'https://restcountries.com/v3.1/name/';
  // Вільтр властивостей, що приймаються з бекєнду для виведення у картку
  const filter = '?fields=name,capital,population,flags,languages';

  // Запрос даних з API через метод fetch
  return fetch(`${libUrl}${name}${filter}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};