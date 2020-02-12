module.exports = {
  plugins: {
    // ...
    'autoprefixer': {
      overrideBrowserslist: ['> 0.15% in CN']
    } // 自动添加css前缀
  },
  'postcss-pxtorem': {
    rootValue: 37.5, // vant-UI的官方根字体大小是37.5
    propList: ['*']
  }
}
