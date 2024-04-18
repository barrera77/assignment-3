import { getRequest, postRequest, deleteRequest } from "./api/requests";

const url = "https://661a03c6125e9bb9f29b2c25.mockapi.io/api/v1/albums";
const favoritesTab = document.querySelector("#favorites-tab");
const searchTab = document.querySelector("#search-tab");
const searchButtton = document.querySelector("#search-button");
const favoritesButtton = document.querySelector("#favorites-button");
const searchForm = document.querySelector("#search-form");
const query = document.querySelector("#query");
const invalidInput = document.querySelector("#invalid-input");
const albumsList = document.querySelector("#albums-list");
const messageContainer = document.querySelector("#message-container");
const feedbackContainer = document.querySelector("#feedback-container");
const btnAddFavourites = document.querySelector("#btn-add-favorites");
const myAlbums = document.querySelector("#my-albums");

//fetch album data
async function fetchAlbumData() {
  const albumsData = await getRequest(url);

  return albumsData;
}

async function fetchFavoriteAlbums() {
  const favoriteAlbumsData = await getRequest(
    "https://661a03c6125e9bb9f29b2c25.mockapi.io/api/v1/favorites"
  );
  return favoriteAlbumsData;
}

//create fetched albums data backup
const albumStore = await fetchAlbumData();

//create fetched favorite albums data backup
const favoriteAlbumStore = await fetchFavoriteAlbums();

console.log(favoriteAlbumStore);

/*TASK 1*/

//Switch to Favorites Tab
favoritesButtton.addEventListener("click", (event) => {
  event.preventDefault();

  //Render favorite albums
  renderFavouriteAlbums();

  favoritesTab.classList.remove("d-none");
  searchTab.classList.add("d-none");

  searchButtton.classList.remove("active");
  favoritesButtton.classList.add("active");

  removeAlbum();
});

//Switch to Search Tab
searchButtton.addEventListener("click", (event) => {
  event.preventDefault();
  searchTab.classList.remove("d-none");
  favoritesTab.classList.add("d-none");

  searchButtton.classList.add("active");
  favoritesButtton.classList.remove("active");
});

/*TASK 2*/
searchForm.addEventListener("submit", onSubmitAlbumSearch);
query.addEventListener("input", onHandleQueryAlbumInput);

function onSubmitAlbumSearch(e) {
  e.preventDefault();
  isSuccess();
}

//Validate input fields
function validateInputFields() {
  const albumInput = query.value.toLowerCase().trim();

  if (albumInput === "") {
    invalidInput.classList.add("d-flex");
    invalidInput.classList.remove("d-none");
  } else {
    invalidInput.classList.remove("d-flex");
    invalidInput.classList.add("d-none");
  }
  return albumInput;
}

//Handle warnings on input event
function onHandleQueryAlbumInput() {
  if (albumInput.value) {
    invalidInput.classList.remove("d-flex");
    invalidInput.classList.add("d-none");
  }
}

//search for the album title/artist name using filter function
function searchAlbumOrArtist(searchCriteria) {
  if (!searchCriteria) {
    return [];
  }
  const query = searchCriteria;

  const results = albumStore.filter((album) => {
    if (album.albumName.toLowerCase().includes(query)) {
      return album;
    }
    if (album.artistName.toLowerCase().includes(query)) {
      return album;
    }
  });
  if (results.length === 0) {
    displaySearchNullMessage();
  }
  return results;
}

//Render search results
function renderAlbumSearch(searchCriteria) {
  const container = albumsList.cloneNode(true);

  try {
    container.innerHTML = ""; //Clear container

    if (searchCriteria.length > 0) {
      searchCriteria.forEach(
        ({ albumName, averageRating, artistName, uid }) => {
          const albumtemplate = `
        <li
        class="list-group-item d-flex justify-content-between align-items-start"
      >
        <div class="ms-2 me-auto">
          <div class="fw-bold">
            ${albumName}
            <span class="badge bg-primary rounded-pill">${averageRating}</span>
          </div>
          <span>${artistName}</span>
        </div>
        <button data-uid="${uid}" type="button" class="btn btn-success btn-add-favorites">
          Add to Favorites
        </button>
      </li>`;
          container.insertAdjacentHTML("afterbegin", albumtemplate);
        }
      );
      document.querySelector("#albums-list").replaceWith(container);
    }
  } catch (error) {
    console.error(error);
  }
}

function isSuccess() {
  const albumlInput = validateInputFields();

  let albumResults = [];

  //filter only by album or artist
  if (albumlInput) {
    messageContainer.innerHTML = ""; //Clear null search msg if present

    albumResults = searchAlbumOrArtist(albumlInput);
    renderAlbumSearch(albumResults);

    const buttons = document.querySelectorAll(".btn-add-favorites");

    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        let albumUid = event.target.dataset.uid;
        addFavouriteAlbums(albumUid);
      });
    });
  }
}

function displaySearchNullMessage() {
  const displayNullSearchMsg = `
  <div>
    <h2>No albums found!!</h2>
  </div>
          `;
  messageContainer.innerHTML = displayNullSearchMsg;
}

/* Task 3 */
let myFavorites = [];

function addFavouriteAlbums(albumUid) {
  const album = albumStore.find((album) => album.uid === albumUid);

  if (album && !myFavorites.some((favAlbum) => favAlbum.uid === albumUid)) {
    feedbackContainer.innerHTML = "";

    myFavorites.push(album);
    console.log("Added to favorites:", album);

    addNewAlbum(album); //call POST request
  } else {
    createFeedbackMessage();
  }
}

function createFeedbackMessage() {
  feedbackContainer.innerHTML = `
  <div class="alert alert-warning p-2 text-dark fw-bold w-75">
  <p class="m-auto">Album already in the list!!!</p>
</div>`;
}

/*TASK 4*/

//Render favourite albums when changing tabs
function renderFavouriteAlbums() {
  const container = myAlbums.cloneNode(true);
  try {
    container.innerHTML = ""; //Clear container

    if (myFavorites.length > 0) {
      myFavorites.forEach(({ albumName, averageRating, artistName, uid }) => {
        const albumtemplate = `
        <li data-uid="${uid}"
        class="list-group-item d-flex justify-content-between align-items-start"
      >
        <div class="ms-2 me-auto">
          <div class="fw-bold">
            ${albumName}
            <span class="badge bg-primary rounded-pill">${averageRating}</span>
          </div>
          <span>${artistName}</span>
        </div>
        <button data-uid="${uid}" type="button" class="btn btn-success btn-remove-favorites">
        Remove from Favorites
        </button>
      </li>`;
        container.insertAdjacentHTML("afterbegin", albumtemplate);
      });
      document.querySelector("#my-albums").replaceWith(container);
    } else {
      myAlbums.innerHTML += `
      <li
      class="list-group-item d-flex justify-content-between align-items-start"
    >
      <div class="ms-2 me-auto">
        <div class="fw-bold">
          OK Computer
          <span class="badge bg-primary rounded-pill">4.23</span>
        </div>
        <span>Radiohead</span>
      </div>
      <button type="button" class="btn btn-success">
        Remove from Favorites
      </button>
    </li>
      `;
    }
  } catch (error) {
    console.error(error);
  }
}

/*TASK 5*/
function addNewAlbum(album) {
  postRequest(album);
}

/* Bonus TASK */

function removeAlbum() {
  const buttons = document.querySelectorAll(".btn-remove-favorites");

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      let albumUid = event.target.dataset.uid;
      removeFavouriteAlbums(albumUid);
    });
  });
}

function removeFavouriteAlbums(albumUid) {
  const album = favoriteAlbumStore.find((album) => album.uid === albumUid);
  deleteRequest(album.id);
  myFavorites.filter((album) => album.uid === albumUid);
  console.log("Removed from favorites:", album);
}
