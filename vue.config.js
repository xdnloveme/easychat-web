module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/style/global.scss";`,
      },
    },
  },
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
}