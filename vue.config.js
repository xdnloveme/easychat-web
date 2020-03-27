const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const Svg2IconfontWebpack = require('svg2iconfont-webpack');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

const resolve = currentPath => {
  return path.resolve(__dirname, './src/', currentPath);
};

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/style/global.scss";`,
      },
    },
  },
  // 其他配置
  configureWebpack: {
    plugins: [
      isEnvProduction &&
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }),
      new Svg2IconfontWebpack({
        assetsPath: resolve('./assets/icon'),
        className: 'easychat-iconfont',
        // output（输出配置）
        output: {
          fileName: 'easychat-font',
          cssFileName: 'easychat-webfont',
        },
        // font options（字体配置）
        fontOptions: {
          // 图标的基准大小
          // icon basic size
          fontSize: 32,
          fontFamily: 'easychat-iconfont',
        },
      }),
    ].filter(Boolean),
  },
  // pwa 配置
  pwa: {
    name: 'EasyChat',
    themeColor: '#4585f4',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js',
    },
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
  },
  // 开发服务器代理
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003/',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3003/',
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
