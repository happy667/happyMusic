const isPro = Object.is(process.env.NODE_ENV, "production");
console.log(isPro);
module.exports = {
    baseUrl: isPro ? 'http://www.happy6year.com:3000' : 'api',
}