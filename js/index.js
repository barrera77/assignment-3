import { getRequest, postRequest, deleteRequest } from "./api/requests";
import {
  albumtemplate,
  favoriteAlbumTemplate,
  defaultAlbumTemplate,
} from "./templates/album";

const albumsUrl = "https://661a03c6125e9bb9f29b2c25.mockapi.io/api/v1/albums";
const favoriteAlbumsUrl =
  "https://661a03c6125e9bb9f29b2c25.mockapi.io/api/v1/favorites";

const favoritesTab = document.querySelector("#favorites-tab");
const searchTab = document.querySelector("#search-tab");
const searchButton = document.querySelector("#search-button");
const favoritesButton = document.querySelector("#favorites-button");
const searchForm = document.querySelector("#search-form");
const query = document.querySelector("#query");
const invalidInput = document.querySelector("#invalid-input");
const albumsList = document.querySelector("#albums-list");
const messageContainer = document.querySelector("#message-container");
const feedbackContainer = document.querySelector("#feedback-container");
const btnAddFavorites = document.querySelector("#btn-add-favorites");
const myAlbums = document.querySelector("#my-albums");

let albumStore = [];
let favoriteAlbumStore = [];

// Fetch album data  when the application starts
async function fetchAlbumData() {
  try {
    albumStore = await getRequest(albumsUrl);
  } catch (error) {
    console.error("Error fetching album data:", error);
  }
}

async function fetchFavoriteAlbums() {
  try {
    favoriteAlbumStore = await getRequest(favoriteAlbumsUrl);
  } catch (error) {
    console.error("Error fetching album data:", error);
  }
}

fetchAlbumData(); //load album data
fetchFavoriteAlbums(); //load favorites data

/* TASK 1 */

// Switch to Favorites Tab
favoritesButton.addEventListener("click", (event) => {
  event.preventDefault();
  renderFavouriteAlbums(myFavorites);
  switchToTab(favoritesTab);
  removeAlbum(); //Initialize the deleteRequest
});

// Switch to Search Tab
searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  switchToTab(searchTab);
});

function switchToTab(tab) {
  favoritesTab.classList.add("d-none");
  searchTab.classList.add("d-none");
  tab.classList.remove("d-none");
}

/* TASK 2 */
searchForm.addEventListener("submit", onSubmitAlbumSearch);
async function onSubmitAlbumSearch(e) {
  e.preventDefault();
  const albumInput = query.value.toLowerCase().trim();
  if (albumInput === "") {
    displayInputError();
  } else {
    messageContainer.innerHTML = ""; // Clear previous messages
    const searchResults = await searchAlbumOrArtist(albumInput);
    renderAlbumSearch(searchResults);
  }
  renderButtons();
}

function displayInputError() {
  invalidInput.classList.add("d-flex");
  invalidInput.classList.remove("d-none");
}

async function searchAlbumOrArtist(albumSearch) {
  const query = albumSearch;
  return albumStore.filter(
    (album) =>
      album.albumName.toLowerCase().includes(query) ||
      album.artistName.toLowerCase().includes(query)
  );
}

function renderAlbumSearch(searchResults) {
  albumsList.innerHTML = ""; // Clear previous search results
  if (searchResults.length === 0) {
    displaySearchNullMessage();
  } else {
    searchResults.forEach(({ albumName, averageRating, artistName, uid }) => {
      albumsList.insertAdjacentHTML(
        "beforeend",
        albumtemplate({ albumName, averageRating, artistName, uid })
      );
    });
  }
}

function displaySearchNullMessage() {
  messageContainer.innerHTML = `<div><h2>No albums found!!</h2></div>`;
}

/* Task 3 */
const renderButtons = () => {
  document.querySelectorAll(".btn-add-favorites").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const albumUid = event.target.dataset.uid;
      await addFavouriteAlbums(albumUid);
    });
  });
};

let myFavorites = [];

async function addFavouriteAlbums(albumUid) {
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
function renderFavouriteAlbums(listOfAlbums) {
  myAlbums.innerHTML = ""; //Clear container

  if (listOfAlbums.length > 0) {
    listOfAlbums.forEach((album) => {
      myAlbums.insertAdjacentHTML("beforeend", favoriteAlbumTemplate(album));
    });
  } else {
    myAlbums.innerHTML += defaultAlbumTemplate;
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

async function removeFavouriteAlbums(albumUid) {
  try {
    await fetchFavoriteAlbums();
    const albumIndex = favoriteAlbumStore.findIndex(
      (album) => album.uid === albumUid
    );

    if (albumIndex !== -1) {
      const removedAlbum = favoriteAlbumStore.splice(albumIndex, 1)[0]; // Remove the album from favoriteAlbumStore
      await deleteRequest(removedAlbum.id); // Delete the album from the API
      myFavorites.splice(albumIndex, 1)[0];

      // Remove the album from the DOM
      const albumElement = myAlbums.querySelector(`[data-uid="${albumUid}"]`);
      if (albumElement) {
        albumElement.remove();
      }

      console.log("Removed from favorites:", removedAlbum.albumName);
    } else {
      console.log("Album not found in favorites:", albumIndex);
    }
  } catch (error) {
    console.error("Error removing favorite album:", error);
  }
}
