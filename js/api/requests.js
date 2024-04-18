export async function getRequest(url) {
  const res = await fetch(url);
  return await res.json();
}

//Make a post request to the API
export async function postRequest(album) {
  //Create request header
  const requestHeader = new Headers();
  requestHeader.append("content-type", "application/json");

  //Format the object as JSON
  const payload = JSON.stringify(album);

  //Request object
  const requestObject = {
    method: "POST",
    headers: requestHeader,
    body: payload,
    redirect: "follow",
  };

  const res = await fetch(
    "https://661a03c6125e9bb9f29b2c25.mockapi.io/favorites",
    requestObject
  );
  console.log("fav", await res.json());
}

export async function deleteRequest() {}
