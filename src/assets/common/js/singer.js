export default class Singer {
  constructor({
    id,
    name,
    avatar,
    aliaName,
    picUrl,
    singers,
    singersList,
    followed,
    followeds,
    mvSize,
    albumSize
  }) {
    this.id = id
    this.name = name
    this.avatar = avatar
    this.aliaName = aliaName
    this.picUrl = picUrl
    this.singers = singers
    this.singersList = singersList
    this.followed = followed
    this.followeds = followeds
    this.mvSize = mvSize
    this.albumSize = albumSize
  }
}
