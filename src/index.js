//Imports
import getUser, { resetPage } from './pixabay_api';
import onSuccessGet, { resetResponseCounter } from './response';
import prepareMarkup, { createMarkup } from './markup';
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
const infiniteTrottle = throttle(infiniteLogic, 500);

//Initialize lightbox
var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

//Event Listener for submit
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  // hideLoadMore();
  searchText = e.target.elements.searchQuery.value.trim('');
  if (searchText) {
    clearGallery();
    resetPage();
    resetResponseCounter();
    await doMagic();
    lightboxRefresh();
    smoothScroll();
    //All logic for Infinite Scroll
    infiniteScroll();
  }
});

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

//Logic about fetching, response handling and markup creation
async function doMagic() {
  try {
    const response = await getUser(searchText);

    if (response.data.hits.length < 40) {
      window.removeEventListener('scroll', infiniteTrottle);
    }
    const validation = onSuccessGet(response);
    const preparation = prepareMarkup(response);
    const magic = createMarkup(preparation, galleryDiv);
  } catch (error) {
    throw new Error(error);
  }
}

//function for infinite scroll
function infiniteScroll() {
  setTimeout(infiniteListener, 1000);
}

function infiniteListener() {
  window.addEventListener('scroll', infiniteTrottle);
}

// function infiniteThrottle() {
//   throttle(infiniteLogic, 500);
// }

function infiniteLogic() {
  var scrollHeight = document.documentElement.scrollHeight;
  var scrollTop = document.documentElement.scrollTop;
  var clientHeight = document.documentElement.clientHeight;
  if (scrollTop + clientHeight > scrollHeight - 500) {
    doMagic();
    lightboxRefresh();
  }
}

//function for smooth scrolling
function smoothScroll() {
  const y = galleryDiv.firstElementChild.getBoundingClientRect().y;
  window.scrollBy({
    top: `${y}`,
    behavior: 'smooth',
  });
}
