/* eslint-disable no-undef */
// src/service-worker.js

// 设置相应缓存的名字的前缀和后缀
workbox.core.setCacheNameDetails({
  prefix: 'easychat',
  suffix: 'v1.0.0',
});
// 让我们的service worker尽快的得到更新和获取页面的控制权
workbox.core.skipWaiting();
workbox.core.clientsClaim();

/*
* vue-cli3.0通过workbox-webpack-plagin 来实现相关功能，我们需要加入
* 以下语句来获取预缓存列表和预缓存他们，也就是打包项目后生产的html，js，css等* 静态文件
*/
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
