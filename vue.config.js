var path = require('path')
const { VantResolver, VantImports } = require('@vant/auto-import-resolver');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');

function resolve (dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.plugin('auto-import').use(AutoImport({
      resolvers: [VantResolver({ importStyle: true })]
    }))
    config.plugin('vue-components').use(Components({
      resolvers: [VantResolver({ importStyle: true })],
    }))
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // entry找到默认的打包入口，调用clear则是删除默认的打包入口
      // add添加新的打包入口
      config.entry('app').clear().add('./src/main-prod.js')

      // 不使用 externals，确保本地打包时依赖可以正常解析
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
    // 设置别名
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('common', resolve('src/assets/common'))
  },
  css: {
    extract: false,
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('autoprefixer')({
              overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
            }),
            //如果有配置 pxtorem，添加排除规则
            require('postcss-pxtorem')({
              rootValue: 37.5,
              propList: ['*'],
              selectorBlackList: ['.van-'], // 排除 Vant 组件
              exclude: /node_modules/i // 排除 node_modules 目录
            })
          ]
        }
      }
    }
  },
  assetsDir: 'static',
  parallel: false,
  // 开发环境使用 '/'，生产环境使用 './'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false, //去除.map文件
  devServer: {
    // 配置 historyApiFallback 支持 Vue Router 的 History 模式
    historyApiFallback: true,
    // 解决跨域问题
    proxy: {
      '/api/baiduApi': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true,
        pathRewrite: { '^/api/baiduApi': '' }
      },
      '/api/baiduMap': {
        target: 'https://api.map.baidu.com',
        changeOrigin: true,
        pathRewrite: { '^/api/baiduMap': '' }
      },
      // 专门用于加载百度地图API的代理路由
      '/api/baiduMap/load': {
        target: 'https://api.map.baidu.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/baiduMap/load': '/api'
        },
        onProxyReq: function (proxyReq, req, res) {
          // 获取API密钥
          const ak = process.env.VUE_APP_BAIDU_MAP_AK;
          if (!ak) {
            console.error('缺少百度地图API密钥');
            return res.status(500).send('Missing Baidu Map API Key');
          }

          // 提取callback参数
          const callback = req.query.callback || 'BMapCallback';

          // 修改代理请求的路径
          proxyReq.path = `/api?v=3.0&ak=${ak}&callback=${callback}&s=1`;
        }
      },
      '/api/weather': {
        target: 'https://api.open-meteo.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/weather': ''
        }
      },
      '/api': {
        //target: 'https://www.happy6year.com', //部署环境地址地址
        target: 'http://localhost:3000', //开发环境地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}