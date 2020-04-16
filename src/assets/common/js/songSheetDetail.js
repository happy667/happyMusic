export default class Singer {
  constructor({
    id,
    picUrl,
    songs,
    name,
    trackUpdateTime,
    tags
  }) {
    this.id = id
    this.name = name
    this.songs = songs
    this.picUrl = picUrl
    this.trackUpdateTime = trackUpdateTime
    this.tags = tags
  }
}
