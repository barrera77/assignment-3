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

/* async function appInit() {
  const res = await fetch(url);
  const payload = await res.json();
  console.log(payload);
} */

//fetch album data
async function fetchAlbumData() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("No data found");
    }
    const data = await response.json();

    //console.table(data); //Log Data for verification purposes
    return data;
  } catch (error) {
    throw error;
  }
}

//create fetched data backup
const albumStore = await fetchAlbumData();

/*TASK 1*/

//Switch to Favorites Tab
favoritesButtton.addEventListener("click", (event) => {
  event.preventDefault();
  favoritesTab.classList.remove("d-none");
  searchTab.classList.add("d-none");

  searchButtton.classList.remove("active");
  favoritesButtton.classList.add("active");
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
  try {
    albumsList.innerHTML = "";
    if (searchCriteria.length > 0) {
      searchCriteria.forEach((album) => {
        const albumtemplate = `
        <li
        class="list-group-item d-flex justify-content-between align-items-start"
      >
        <div class="ms-2 me-auto">
          <div class="fw-bold">
            ${album.albumName}
            <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
          </div>
          <span>${album.artistName}</span>
        </div>
        <button data-uid="${album.uid}" type="button" class="btn btn-success btn-add-favorites">
          Add to Favorites
        </button>
      </li>`;
        albumsList.innerHTML += albumtemplate;
      });
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
        console.log("Button clicked");
        let albumUid = event.target.dataset.uid;
        console.log(albumUid);
        addFavouriteAlbums(albumUid);
      });
    });
  }
}

function displaySearchNullMessage() {
  const displayNullSearchMsg = `
          <div id="null-search-message" class="d-flex mx-3">
            <h1>No albums found!!</h1>
          </div>
          `;
  messageContainer.innerHTML = displayNullSearchMsg;
}

/* Task 3 */
let myFavourites = [];

function addFavouriteAlbums(albumUid) {
  if (myFavourites.includes(albumUid)) {
    feedbackContainer.innerHTML = "";

    myFavourites.push(albumUid);
    console.log(myFavourites);
  } else {
    createFeedbackMessage();
  }
}

function createFeedbackMessage() {
  feedbckContainer.innerHTML = `
    <p class="m-auto">Album already in the list!!!</p>
  
  `;
}
