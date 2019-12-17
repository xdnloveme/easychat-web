const TerserPlugin = require('terser-webpack-plugin');

const TerserPluginConfig = [];

if (process.env.NODE_ENV === 'production') {
  TerserPluginConfig.push(
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    }),
  );
}

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
      ...TerserPluginConfig,
    ],
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
