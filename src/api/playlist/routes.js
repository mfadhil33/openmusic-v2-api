const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistsHandler,
    options: {
      auth: "playlistapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "playlistapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}",
    handler: handler.getPlaylistByIdHandler,
    options: {
      auth: "playlistapp_jwt",
    },
  },
  {
    method: "PUT",
    path: "/playlists/{id}",
    handler: handler.putPlaylistByIdHandler,
    options: {
      auth: "playlistapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists",
    handler: handler.deletePlaylistsHandler,
    options: {
      auth: "playlistapp_jwt",
    },
  },
];
module.exports = routes;
