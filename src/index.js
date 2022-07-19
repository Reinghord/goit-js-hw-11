//Imports
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getUser, { resetPage } from './pixabay_api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

//Refs
const { searchForm, galleryDiv, moreBtn } = {
  searchForm: document.querySelector('.search-form'),
  galleryDiv: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};
let searchText;
let RESPONSE_COUNTER = 1;

//Initialize lightbox
var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

//Event Listener for submit
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  // hideLoadMore();
  clearGallery();
  searchText = e.target.elements.searchQuery.value;
  resetPage();
  resetResponseCounter();
  const response = await getUser(searchText);
  const validation = onSuccessGet(response);
  const magic = createMarkup(validation);
  lightboxRefresh();
  smoothScroll();

  //Event Listener for Infinite Scroll
  setTimeout(() => {
    window.addEventListener(
      'scroll',
      throttle(async function () {
        var scrollHeight = document.documentElement.scrollHeight;
        var scrollTop = document.documentElement.scrollTop;
        var clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight > scrollHeight - 500) {
          const response = await getUser(searchText);
          const validation = onSuccessGet(response);
          const magic = createMarkup(validation);
          lightboxRefresh();
        }
      }, 500)
    );
  }, 1000);
});

//function to validate response for amount of hits before creating markup
function onSuccessGet(response) {
  if (response.data.total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    throw new Error(error);
  }

  if (RESPONSE_COUNTER === 1) {
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
  }

  if (response.data.hits.length < 40) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    // hideLoadMore();
    return response.data.hits;
  }

  // showLoadMore();
  RESPONSE_COUNTER += 1;
  return response.data.hits;
}

//function to create markup in 1 DOM manipulation
function createMarkup(data) {
  console.log(data);
  const markup = data.map(object => {
    return `<a class="photo-card" href="${object.largeImageURL}">
  <img src="${object.webformatURL}" alt="${object.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b></br> ${object.likes}
    </p>
    <p class="info-item">
      <b>Views</b></br> ${object.views}
    </p>
    <p class="info-item">
      <b>Comments</b></br> ${object.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b></br> ${object.downloads}
    </p>
  </div>
</a>`;
  });
  galleryDiv.insertAdjacentHTML('beforeend', markup.join(''));
}

//function to clear gallery
function clearGallery() {
  galleryDiv.innerHTML = '';
}

// //function to display ShowMore button
// function showLoadMore() {
//   moreBtn.classList.remove('hidden');
// }

// //function to hide ShowMore button
// function hideLoadMore() {
//   moreBtn.classList.add('hidden');
// }

//function to refresh lightbox instance
function lightboxRefresh() {
  lightbox.refresh();
}

//function for smooth scrolling
function smoothScroll() {
  const y = galleryDiv.firstElementChild.getBoundingClientRect().y;
  window.scrollBy({
    top: `${y}`,
    behavior: 'smooth',
  });
}

//Export for function to reset PAGE_COUNTER
function resetResponseCounter() {
  RESPONSE_COUNTER = 1;
}
