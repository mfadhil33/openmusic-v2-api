const routes = require("../albums/routes");
const PlaylistHandler = require("./handler");

module.exports = {
  name: "playlist",
  version: "2.0.0",
  register: async (server, { playlistsService, usersService, validator }) => {
    const playlistHandler = new PlaylistHandler(
      playlistsService,
      usersService,
      validator
    );
    server.route(routes(playlistHandler));
  },
};
