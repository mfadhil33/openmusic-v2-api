const AlbumsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "albumsapp",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumshandler = new AlbumsHandler(service, validator);
    server.route(routes(albumshandler));
  },
};
