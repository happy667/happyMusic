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
        followDay,
        followCount,
        songSize,
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
        this.followCount = followCount
        this.mvSize = mvSize
        this.songSize = songSize
        this.albumSize = albumSize
        this.followDay = followDay
    }
}