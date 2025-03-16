export default class User {
    constructor({
        userId,
        nickname,
        avatarUrl,
        gender,
        province,
        city,
        createDays,
        createTime,
        birthday,
        backgroundUrl
    }) {
        this.userId = userId
        this.nickname = nickname
        this.avatarUrl = avatarUrl
        this.gender = gender
        this.province = province
        this.city = city
        this.createDays = createDays
        this.createTime = createTime
        this.birthday = birthday
        this.backgroundUrl = backgroundUrl
    }
}