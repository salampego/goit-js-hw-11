const axios = require('axios');
const gallery = document.querySelector('.gallery');
export default class PixabayPhotos {
  constructor() {
    this.searchValue = '';
    this.page = 1;
    this.dataTotalHits = 0;
  }

  async fetchPhotos() {
    const url = `https://pixabay.com/api/?key=26652166-68919f4336d4ff6c386516ecc&q=${this.searchValue}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`;
    this.page += 1;
    const response = await axios.get(url);
    return await response.data;
  }

  resetPage() {
    this.dataTotalHits = 0;
    this.page = 1;
    gallery.innerHTML = '';
  }

  get dataTotal() {
    return this.dataTotalHits;
  }

  set dataTotal(newDataTotal) {
    this.dataTotalHits = newDataTotal;
  }

  get searchQuery() {
    return this.searchValue;
  }
  set searchQuery(newQuerry) {
    this.searchValue = newQuerry;
  }
}
