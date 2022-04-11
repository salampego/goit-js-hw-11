import Notiflix from 'notiflix';
import './sass/main.scss';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '26652166-68919f4336d4ff6c386516ecc';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', fetchPhotos);

function fetchPhotos(name) {
  name.preventDefault();
  const nameInputValue = name.target[0].value;
  fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${nameInputValue}&image_type=photo&orientation=horizontal&safesearch=true`,
  )
    .then(response => response.json())
    .then(data => {
      if (data.total === 0) {
        gallery.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }
      const date = data.hits;
      const markupInfo = markupPhoto(date);
      gallery.innerHTML = gallery.innerHTML = markupPhoto(date);
    });
}

const markupPhoto = data => {
  data
    .map(dat => {
      return `<p>loh${dat}</p>`;
    })
    .join('');
};

/* <div class="photo-card">
  <img src="${dat.webformatURL}" alt="${dat.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${dat.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${dat.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${dat.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${dat.downloads}</b>
    </p>
  </div>
</div>; */
