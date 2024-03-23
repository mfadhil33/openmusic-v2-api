/* eslint-disable function-paren-newline */
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const {
  filterPerformerSongByParam,
  mapSongs,
  fillTitleSongByparam,
} = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }
  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const queryResult = await this._pool.query(query);

    if (!queryResult.rows[0].id) {
      throw new InvariantError("Failed to add the song");
    }

    return queryResult.rows[0].id;
  }
  async getSongs(params) {
    const query = {
      text: "SELECT id, title, performer FROM songs",
    };
    const queryResult = await this._pool.query(query);
    const songs = queryResult.rows;
    let filteredSong = songs;
    if ("title" in params) {
      filteredSong = filteredSong.filter((s) =>
        fillTitleSongByparam(s, params.title)
      );
    }
    if ("performer" in params) {
      filteredSong = filteredSong.filter((s) =>
        filterPerformerSongByParam(s, params.performer)
      );
    }

    return filteredSong;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const queryResult = await this._pool.query(query);

    if (!queryResult.rows.length) {
      throw new NotFoundError("Song not found");
    }
    return queryResult.rows.map(mapSongs)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id",
      values: [title, year, performer, genre, duration, id],
    };
    const queryResult = await this._pool.query(query);

    if (!queryResult.rows.length) {
      throw new NotFoundError("Failed to update the song. Id not found.");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const queryResult = await this._pool.query(query);

    if (!queryResult.rows.length) {
      throw new NotFoundError("Failed to delete the song. Id not found.");
    }
  }
}
module.exports = SongsService;
