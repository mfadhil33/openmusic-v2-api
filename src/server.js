require("dotenv").config();
const Hapi = require("@hapi/hapi");

// albums
const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/albumsService");
const AlbumsValidator = require("./validator/albums");

// songs
const songs = require("./api/songs");

const SongsValidator = require("./validator/songs");
const SongsService = require("./services/postgres/SongsService");
const ClientError = require("./exceptions/ClientError");

// playlist
const playlist = require("./api/playlist");
const playlistService = require("./services/postgres/PlaylistsService");
const playlistValidator = require("./validator/playlists");

// user
const user = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const usersValidator = require("./validator/users");

const init = async () => {
  // album
  const albumsService = new AlbumsService();

  // song
  const songServices = new SongsService();

  // users
  const userServices = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("notesapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songServices,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        service2: usersService,
        validator: playlistValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userServices,
        validator: usersValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
