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
