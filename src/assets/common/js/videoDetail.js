export default class VideoDetail {
  constructor({
    id,
    coverUrl,
    name,
    playCount,
    artist,
    url,
    commentCount,
    likeCount,
    shareCount,
    subCount,
    publishTime,
    desc,
    duration,
    creatorName,
    creatorList,
    followed,
    liked
  }) {
    this.id = id
    this.coverUrl = coverUrl
    this.name = name
    this.playCount = playCount
    this.artist = artist
    this.url = url
    this.commentCount = commentCount
    this.likeCount = likeCount
    this.shareCount = shareCount
    this.subCount = subCount
    this.publishTime = publishTime
    this.desc = desc
    this.duration = duration
    this.creatorName = creatorName
    this.creatorList = creatorList
    this.followed = followed
    this.liked = liked
  }
}
