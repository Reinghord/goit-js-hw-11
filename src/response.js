import { Notify } from 'notiflix/build/notiflix-notify-aio';
let RESPONSE_COUNTER = 1;

//function to validate response for amount of hits before creating markup
export default function onSuccessGet(response) {
  if (response.data.hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (RESPONSE_COUNTER === 1) {
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
  } else if (response.data.hits.length < 40) {
    return Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    // hideLoadMore();
  }

  // showLoadMore();
  RESPONSE_COUNTER += 1;
}

//Export for function to reset PAGE_COUNTER
export const resetResponseCounter = () => {
  RESPONSE_COUNTER = 1;
};
