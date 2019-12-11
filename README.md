# easychat-web
简聊(easychat-web)✨✨，简单、完全开源的，轻量、一体化组件项目，有兴趣的可以pr一起改进这个项目

+ 简聊H5在线预览（preview）:http://chat.tangyida.top.
+ 服务端源码地址（server-source）:[easychat后台源码](https://github.com/xdnloveme/easychat)（koa2 + mysql ，orm层是*sequ*lize，自己搭的MVC架构）
+ 测试账号（Test Acount）:`admin` 密码: `123456`

手机端扫码预览:![scan](https://github.com/xdnloveme/MarkdownPictureStore/blob/master/1576056911.png?raw=true)

作者注：此项目正在测试beta版本，后续会跟进开发，有些底层组件由于个人时间有限和一些特殊情况，开发比较粗糙，文档也没完善。有兴趣开发改进底层组件的欢迎pr改进或者提交issues.



## 🖼 截图预览（Preview）

![preview-index](https://github.com/xdnloveme/MarkdownPictureStore/blob/master/15760542963337.png?raw=true)

![preiview-image](https://github.com/xdnloveme/MarkdownPictureStore/blob/master/15760544133912.png?raw=true)



## 🦋 起源（Why）

一直对实时通讯有偏爱，同时想巩固单人前后端项目一体化的能力，前端技术栈（Vue + Vue-cli 3 + socket.io.client），没有用到**第三方组件库**，希望从零开始开发H5底层组件，希望屏幕前的你可以加入进来改善项目。



## ✨特性（Features）

+ 轻量（light）没有任何冗余的第三方组件库，组件全是自己编写自己提供，易于管理，容量轻量。
+ 一体化定制化（intergration）组件高度定制化，不用担心风格不统一。
+ 交互、过渡动效友好（transition）项目各个页面有较多的过渡动效，整体交互友好。
+ 简单、实时高效（easy）项目结构清晰，可以支持多人聊天和一对一私聊。

未来即将实现的特性（正在开发）：

+ 自动化配置（auto）:剥离配置，达到配置=>构造组件的逻辑，利用Webpack和AST实现自动添加图标、页面可配置等效果。
+ 优化兼容性（polyfill）:优化各个底层组件在各大浏览器性能，整体兼容性提高。



## ⚙ 安装（Install）

```javascript
npm install
```

```javascript
npm run serve
```

记得开启服务端后台：[easychat后台](https://github.com/xdnloveme/easychat)服务，本地开发默认地址是`http://localhost:8080`



## 📖 文档（Doc）

持续跟进