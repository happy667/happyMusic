// 检查是否为空
export function checkIsNull(value) {
    return value.trim() === ''
}
// 昵称
export const NIKENAME_VALID_TEXT = '昵称由4-16位字母,数字,汉字,下划线组成'
export function checkNickname(nickname) {
    return /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,16}$/.test(nickname)
}
// 手机号
export function checkPhone(phone) {
    return /^1[3456789]\d{9}$/.test(phone)
}
// 密码
export const PASSWORD_VALID_TEXT = '密码必须由8-16位,字母、数字组成'
export function checkPassword(password) {
    return /^.*(?=.{8,16})((?=.*\d)(?=.*[A-Z]))|((?=.*\d)(?=.*[a-z]))|((?=.*\d)(?=.*[!@#$%^&*? ]))|((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[!@#$%^&*? ]))|((?=.*[a-z])(?=.*[!@#$%^&*? ])).*$/.test(password)
}
// 比较两个值
export function compare(value1, value2) {
    return value1.trim() === value2.trim()
}