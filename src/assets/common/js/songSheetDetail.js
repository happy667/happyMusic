export default class Singer {
  constructor({
    id,
    picUrl,
    songs,
    name,
    trackUpdateTime,
    tags,
    commentCount,
    playCount,
    description,
    creator,
    updateTime,
    followed,
    backgroundCoverUrl
  }) {
    this.id = id
    this.name = name
    this.songs = songs
    this.picUrl = picUrl
    this.tags = tags
    this.commentCount = commentCount
    this.playCount = playCount
    this.description = description
    this.creator = creator
    this.updateTime = updateTime
    this.followed = followed
    this.backgroundCoverUrl = backgroundCoverUrl
  }
}
