const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
  baseUrl: './',
  assetsDir: './static',
  productionSourceMap: false,
  devServer: {
    open: true,
    // 设置主机地址
    host: 'localhost',
    // 设置默认端口
    port: 8080,
    // 设置代理
    proxy: {
      '/api': {
        // 目标 API 地址
        target: 'http://localhost:3000/',
        // 如果要代理 websockets
        ws: false,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true
      }
    }

  },
  chainWebpack: config => {
    config
      .node.set('fs', 'empty').end()
      .resolve.alias.set('cesium', path.resolve(__dirname, cesiumSource)).end().end()
      .amd({
        toUrlUndefined: true
      })
      .module
      .set('unknownContextCritical', false)
      .rule()
      .include
      .add(path.resolve(__dirname, cesiumSource))
      .end()
      .post()
      .pre()
      .test(/\.js$/)
      .use('strip')
      .loader('strip-pragma-loader')
      .options({
        pragmas: {
          debug: false
        }
      })
      .end()
      .end()
  },
  configureWebpack: config => {
    let plugins = [];
    if (process.env.NODE_ENV === 'production') {
      plugins = [
        new webpack.DefinePlugin({
          'CESIUM_BASE_URL': JSON.stringify('static')
        }),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'static/Workers' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'static/Assets' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'static/Widgets' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty'), to: 'static/ThirdParty' }]),
        new CopyWebpackPlugin([{ from: path.join('public', 'Cesium'), to: 'static/Cesium' }]),
        new CopyWebpackPlugin([{ from: path.join('public', 'data'), to: 'static/data' }]),
      ]
    } else {
      plugins = [
        new webpack.DefinePlugin({
          'CESIUM_BASE_URL': JSON.stringify('')
        }),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
        new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty' }]),
        new CopyWebpackPlugin([{ from: path.join('public', 'Cesium'), to: 'static/Cesium' }]),
        new CopyWebpackPlugin([{ from: path.join('public', 'data'), to: 'static/data' }]),
      ]
    }
    return {
      plugins: plugins
    }
  }
}