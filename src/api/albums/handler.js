const ClientError = require("../../exceptions/ClientError");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year });

      const res = h.response({
        status: "success",
        message: "Album successfully added",
        data: {
          albumId,
        },
      });
      res.code(201);
      return res;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Sorry, there was a failure on our server",
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      return {
        status: "success",
        data: {
          album,
        },
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Sorry, there was a failure on our server.",
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }
  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;

      await this._service.editAlbumById(id, request.payload);

      return {
        status: "success",
        message: "Album successfully added",
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Sorry, there was a failure on our server.",
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }
  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);

      return {
        status: "success",
        message: "Album successfully deleted",
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Sorry, there was a failure on our server.",
      });
      response.code(500);
      console.error(err);
      return response;
    }
  }
}
module.exports = AlbumsHandler;
