class PlaylistHandler {
  constructor(playlistService, usersService, validator) {
    this._playlistsService = playlistService;
    this._validator = validator;
    this._usersService = usersService;

    this.postPlaylistsHandler = this.postPlaylistsHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this);
    this.putPlaylistByIdHandler = this.putPlaylistByIdHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistsHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;

    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistService.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      message: "Playlist berhasil ditambahkan",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    const playlistP = playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
    }));
    return {
      status: "success",
      data: {
        playlist: playlistP,
      },
    };
  }

  async getPlaylistByIdHandler(request, h) {
    const { id } = request.params;

    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistsService;
    const playlist = await this._playlistsService.getPlaylistById(id);

    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async putPlaylistByIdHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistsService.editPlaylistById(id, request.payload);

    return {
      status: "success",
      message: "Playlist berhasil diperbarui",
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;

    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, credentialId);

    await this._playlistsService.deletePlaylistById(id);

    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }
}

module.exports = PlaylistHandler;
