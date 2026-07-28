const isPro = Object.is(import.meta.env.NODE_ENV, "production");
console.log(isPro);
// 开发环境使用绝对路径 '/api'，避免被拼接到当前路由路径下
export const baseUrl = isPro ? 'https://www.happy6year.com' : '/api'
// 开发环境使用绝对路径 '/api'，避免被拼接到当前路由路径下
