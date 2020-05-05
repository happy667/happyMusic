const isPro = Object.is(process.env.NODE_ENV, 'production')
console.log(isPro)
module.exports = {
  baseUrl: isPro ? 'http://120.77.183.150:3000' : 'api'
}
