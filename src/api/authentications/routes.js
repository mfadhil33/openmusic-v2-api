const routes = (handler) => [
  {
    //  autentikasi pengguna/login
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthenticationHandler,
  },
  {
    // memperbarui access token
    method: "PUT",
    path: "/authentications",
    handler: handler.putAuthenticationHandler,
  },
  {
    // menghapus autentikasi
    method: "DELETE",
    path: "/authentications",
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = routes;
