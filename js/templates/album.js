export const albumtemplate = ({
  albumName,
  averageRating,
  artistName,
  uid,
}) => `
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
<button data-uid="${uid}" type="button" class="btn btn-success btn-add-favorites">
Add to Favorites
</button>
</li>`;

export const favoriteAlbumTemplate = ({
  albumName,
  averageRating,
  artistName,
  uid,
}) => `
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

// Define your default album template
export const defaultAlbumTemplate = `
<li
class="list-group-item d-flex justify-content-between align-items-start"
>
<div class="ms-2 me-auto">
  <div class="fw-bold">
    Name of the Album
    <span class="badge bg-primary rounded-pill">4.23</span>
  </div>
  <span>Artist</span>
</div>
<button
  data-uid="uid"
  id=""
  type="button"
  class="btn btn-success"
>
Remove from Favorites
</button>
</li>>
`;
