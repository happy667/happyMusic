const isPro = Object.is(process.env.NODE_ENV, "production");
console.log(isPro);
module.exports = {
    // 开发环境使用绝对路径 '/api'，避免被拼接到当前路由路径下
    baseUrl: isPro ? 'https://www.happy6year.com' : '/api',
}