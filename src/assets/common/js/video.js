export default class Song {
  constructor({
    id,
    coverUrl,
    name,
    playCount,
    artist,
    duration,
    creatorName
  }) {
    this.id = id
    this.coverUrl = coverUrl
    this.name = name
    this.playCount = playCount
    this.artist = artist
    this.duration = duration
    this.creatorName = creatorName
  }
}
