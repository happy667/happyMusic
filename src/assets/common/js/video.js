export default class Song {
  constructor({
    id,
    coverUrl,
    name,
    playCount,
    artist,
    url
  }) {
    this.id = id
    this.coverUrl = coverUrl
    this.name = name
    this.playCount = playCount
    this.artist = artist
    this.url = url
  }
}
