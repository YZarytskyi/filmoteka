import { Notify } from 'notiflix';
import { fetchGenresList, fetchTopFilms } from './api';
import Pagination from 'tui-pagination';
import { options } from './pagination';

const list = document.querySelector('.films__list');
let genresList = null;
const spinner = document.querySelector('.js-spinner');

const fetchTopFilmsPage = async page => {
  const {
    data: { results: filmArray, total_results },
  } = await fetchTopFilms();
  return [filmArray, total_results];
};

(async () => {
  try {
    spinner.hidden = false;
    const {
      data: { results: filmArray, total_pages },
    } = await fetchTopFilms();
    const {
      data: { genres },
    } = await fetchGenresList();
    const options = {
      totalItems: filmArray.length,
      itemsPerPage: 20,
      visiblePages: 7,
      page: 1,
      centerAlign: false,
      firstItemClassName: 'tui-first-child',
      lastItemClassName: 'tui-last-child',
      template: {
        page: '<a href="#" class="tui-page-btn">{{page}}</a>',
        currentPage:
          '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
        moveButton:
          '<a href="#" class="tui-page-btn tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</a>',
        disabledMoveButton:
          '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</span>',
        moreButton:
          '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
          '<span class="tui-ico-ellip">...</span>' +
          '</a>',
      },
    };
    console.log(filmArray);
    const pagination = new Pagination('pagination', options);
    pagination.on('afterMove', async function ({ page }) {
      console.log('page', page);
      const {
        data: { results: filmArray },
      } = await fetchTopFilms(page);
      const items = createFilmItemMarkup(filmArray);
      list.innerHTML = items;
    });
    // localStorage.setItem('filmArray', filmArray);
    genresList = genres;
    const items = createFilmItemMarkup(filmArray);
    list.innerHTML = items;
  } catch (error) {
    Notify.failure(error);
  } finally {
    spinner.hidden = true;
  }
})();

export function createFilmItemMarkup(filmArray) {
  return filmArray
    .map(el => {
      let elGenres = [];
      for (let i = 0; i < el.genre_ids.length; i++) {
        for (let index = 0; index < genresList.length; index++) {
          if (genresList[index].id === el.genre_ids[i]) {
            elGenres.push(genresList[index].name);
          }
        }
      }

      elGenres = elGenres.length ? elGenres.join(', ') : '';
      let releaseDate = new Date(el.release_date).getFullYear();
      if (elGenres && releaseDate) {
        releaseDate = `| ${releaseDate}`;
      } else {
        releaseDate = releaseDate || '';
      }

      const imageSrc = el.poster_path
        ? `https://image.tmdb.org/t/p/original/${el.poster_path}`
        : 'https://www.reelviews.net/resources/img/default_poster.jpg';

      return `
    <li class="films__item" data-filmId="${el.id}">
      <a href="" class="films__link" role="button">
        <div class="films__img-container">
          <img
            src="${imageSrc}"
            alt="${el.original_title} poster"
            class="films__img"
          />
        </div>
        <h2 class="films__title">${el.original_title}</h2>
        <p class="films__description">
          ${elGenres} ${releaseDate}
        </p>
      </a>
    </li>`;
    })
    .join('');
}
