export async function getRequest(url) {
  const res = await fetch(url);
  return await res.json();
}

export async function postRequest(album) {
  const requestHeader = new Headers();

  requestHeader.append("content-type", "application/json");

  const payload = JSON.stringify(album);

  const requestObject = {
    method: "POST",
    headers: requestHeader,
    body: payload,
    redirect: "follow",
  };

  const res = await fetch(
    "https://661a03c6125e9bb9f29b2c25.mockapi.io/api/v1/albums",
    requestObject
  );
}

export async function deleteRequest() {}
