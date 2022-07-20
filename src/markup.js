//function to create markup in 1 DOM manipulation
export default function prepareMarkup(response) {
  return response.data.hits.map(object => {
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
}

//
export function createMarkup(markup, element) {
  element.insertAdjacentHTML('beforeend', markup.join(''));
}
