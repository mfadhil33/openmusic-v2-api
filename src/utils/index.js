const mapSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});
const fillTitleSongByparam = (song, title) =>
  song.title.toLowerCase().includes(title);
const filterPerformerSongByParam = (song, performer) =>
  song.performer.toLowerCase().includes(performer);
module.exports = {
  mapSongs,
  filterPerformerSongByParam,
  fillTitleSongByparam,
};
