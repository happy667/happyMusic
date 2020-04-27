export default class VideoDetail {
  constructor({
    id,
    coverUrl,
    name,
    playCount,
    artist,
    url,
    commentCount,
    publishTime,
    desc,
    duration
  }) {
    this.id = id
    this.coverUrl = coverUrl
    this.name = name
    this.playCount = playCount
    this.artist = artist
    this.url = url
    this.commentCount = commentCount
    this.publishTime = publishTime
    this.desc = desc
    this.duration = duration
  }
}
