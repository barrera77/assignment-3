const url = "https://661a03c6125e9bb9f29b2c25.mockapi.io/api/v1/albums";
const favoritesTab = document.querySelector("#favorites-tab");
const searchTab = document.querySelector("#search-tab");
const searchButtton = document.querySelector("#search-button");
const favoritesButtton = document.querySelector("#favorites-button");
const searchForm = document.querySelector("#search-form");
const query = document.querySelector("#query");

async function appInit() {
  const res = await fetch(url);
  const payload = await res.json();
  console.log(payload);
}
appInit();

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
  //isSuccess();
}

function onHandleQueryAlbumInput() {}

function validateInputFields() {
  const albumInput = query.value.toLowerCase().trim();

  if (albumInput === "") {
  }
}
