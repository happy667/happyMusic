export default class Singer {
  constructor({
    id,
    picUrl,
    songs,
    name
  }) {
    this.id = id
    this.name = name
    this.songs = songs
    this.picUrl = picUrl
  }
}
