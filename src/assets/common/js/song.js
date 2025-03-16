export default class Song {
    constructor({
        id,
        name,
        singers,
        singersList,
        picUrl,
        playCount,
        st = 0,
        mv,
        album,
        isOriginal
    }) {
        this.id = id
        this.name = name
        this.singers = singers
        this.picUrl = picUrl
        this.singersList = singersList
        this.isLike = false
        this.playCount = playCount
        this.st = st
        this.mv = mv
        this.album = album
        this.isOriginal = isOriginal
    }
}