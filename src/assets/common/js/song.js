export default class Song {
  constructor({
    id,
    name,
    singers,
    singersId,
    picUrl
  }) {
    this.id = id
    this.name = name
    this.singers = singers
    this.picUrl = picUrl
    this.singersId = singersId
  }
}
