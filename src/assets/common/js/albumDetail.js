export default class Album {
    constructor({
        id,
        name,
        picUrl,
        singers,
        singerList,
        publishTime,
        subType,
        company,
        description,
        blurPicUrl
    }) {
        this.id = id
        this.name = name
        this.picUrl = picUrl
        this.singers = singers
        this.publishTime = publishTime
        this.singerList = singerList
        this.subType = subType
        this.description = description
        this.blurPicUrl = blurPicUrl
        this.company = company
    }
}