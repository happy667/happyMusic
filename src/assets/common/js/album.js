export default class Album {
  constructor({
    id,
    name,
    picUrl,
    singerName,
    size,
    publishTime
  }) {
    this.id = id
    this.name = name
    this.picUrl = picUrl
    this.singerName = singerName
    this.publishTime = publishTime
    this.size = size
  }
}
