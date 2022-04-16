import Notiflix from 'notiflix';
import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import PixabayPhotos from './js/fetchPhotos';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import debounce from 'debounce';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

const pixabayPhotos = new PixabayPhotos();
const debounceInfScroll = debounce(onInfinityScroll, 300);

const onSubmit = e => {
  e.preventDefault();
  pixabayPhotos.searchValue = e.currentTarget.elements.searchQuery.value;
  pixabayPhotos.resetPage();
  loadMoreFetch();

  setTimeout(() => {
    if (pixabayPhotos.dataTotal > 0) {
      Notiflix.Notify.success(`Hooray! We found ${pixabayPhotos.dataTotal} images.`);
    }
  }, 1000);
};

const loadMoreFetch = e => {
  let sumPages = pixabayPhotos.page * 40;

  pixabayPhotos.fetchPhotos().then(data => {
    pixabayPhotos.dataTotal = data.totalHits;
    if (data.totalHits === 0 || pixabayPhotos.searchValue == '') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }
    if (sumPages >= data.totalHits) {
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
      window.removeEventListener('scroll', debounceInfScroll);
      galleryLightBox.refresh();
      return;
    } else {
      const markupInfo = markupPhoto(data.hits);
      gallery.insertAdjacentHTML('beforeend', markupInfo);
      window.addEventListener('scroll', debounceInfScroll);
      let galleryLightBox = new SimpleLightbox('.photo-card__link');
      galleryLightBox.refresh();
    }
  });
};

function markupPhoto(data) {
  return data
    .map(dat => {
      const { webformatURL, tags, likes, views, comments, downloads, largeImageURL } = dat;

      return ` <div class="photo-card">
  <a class ="photo-card__link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width = "369" heigth = "250" class ="photo-card__picture"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
       ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div> `;
    })
    .join('');
}

const lazyScroll = () => {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

function onInfinityScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 6) {
    loadMoreFetch();
    lazyScroll();
  }
}

form.addEventListener('submit', onSubmit);
