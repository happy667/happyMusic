export default class Song {
  constructor({
    id,
    name,
    singers,
    singersList,
    picUrl
  }) {
    this.id = id
    this.name = name
    this.singers = singers
    this.picUrl = picUrl
    this.singersList = singersList
  }
}
