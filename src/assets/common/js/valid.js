// 检查是否为空
export function checkIsNull(value) {
  return value.trim() === ''
}
// 手机号
export function checkPhone(phone) {
  return /^1[3456789]\d{9}$/.test(phone)
}
// 密码
export function checkPassword(password) {
  return /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,16}$/.test(password)
}
// 比较两个值
export function compare(value1, value2) {
  return value1.trim() === value2.trim()
}
