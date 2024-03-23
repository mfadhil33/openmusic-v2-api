const routes = require("../albums/routes");
const PlaylistHandler = require("./handler");

module.exports = {
  name: "playlist",
  version: "2.0.0",
  register: async (server, { service, service2, validator }) => {
    const playlistHandler = new PlaylistHandler(service, service2, validator);
    server.route(routes(playlistHandler));
  },
};
