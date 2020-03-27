# easychat-web
简聊(easychat-web)✨✨，简单、完全开源的，轻量、一体化组件项目，有兴趣的可以pr一起改进这个项目

+ 简聊H5在线预览（preview）:http://chat.tangyida.top.
+ 服务端源码地址（server-source）:[easychat后台源码](https://github.com/xdnloveme/easychat)（koa2 + mysql ，orm层是*sequ*lize，自己搭的架构）
+ 测试账号（Test Acount）:`admin` 密码: `123456`
+ 本项目组件库已经单独打包（Component lib）：https://github.com/xdnloveme/easychat-ui

**手机端**可以直接扫如下二维码预览：

![scan](https://github.com/xdnloveme/MarkdownPictureStore/blob/master/1576056911.png?raw=true)

<u>作者注：此项目正在测试beta版本，后续会跟进开发，有些底层组件由于个人时间有限和一些特殊情况，开发比较粗糙，文档也没完善。有兴趣开发改进底层组件的欢迎pr改进或者提交issues.</u>



## 🖼 截图预览（Preview）

![preview-index](https://github.com/xdnloveme/MarkdownPictureStore/blob/master/15760542963337.png?raw=true)

![preiview-image](https://github.com/xdnloveme/MarkdownPictureStore/blob/master/15760544133912.png?raw=true)



## 🦋 起源（Why）

一直对实时通讯有偏爱，同时想巩固单人前后端项目一体化的能力，前端技术栈（Vue + Vue-cli 3 + socket.io.client），没有用到**第三方组件库**，希望从零开始开发H5底层组件，希望屏幕前的你可以加入进来改善项目，此项目的组件库地址[easychat-ui](https://github.com/xdnloveme/easychat-ui)，已经打包，欢迎拍砖。



## ✨特性（Features）

+ 轻量（light）没有任何冗余的第三方组件库，组件全是自己编写自己提供，易于管理，容量轻量。
+ 一体化定制化（intergration）组件高度定制化，不用担心风格不统一。
+ 交互、过渡动效友好（transition）项目各个页面有较多的过渡动效，整体交互友好。
+ 简单、实时高效（easy）项目结构清晰，可以支持多人聊天和一对一私聊。

未来即将实现的特性（正在开发）：

+ 自动化配置（auto）:剥离配置，达到配置=>构造组件的逻辑，利用Webpack和黑箱脚手架实现页面可配置等效果。
+ 优化兼容性（polyfill）:优化各个底层组件在各大浏览器性能，整体兼容性提高。
+ PWA实现（PWA）:准备加入PWA架构，实现桌面离线版H5应用。



## ⚙ 安装（Install）

安装依赖

```javascript
npm install
```

运行在开发环境

```javascript
npm run serve
```

构建

```javascript
npm run build
```

记得开启服务端后台：[easychat后台服务和Redis服务（需要本地安装redis-server），本地开发默认地址是`http://localhost:8080`



## 📖 文档（Doc）

```json
.
├── LICENSE
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── async-runtime.js
│   ├── favicon.ico 
│   ├── img
│   │   └── icons // PWA设置的各类图标
│   │       ├── apple-touch-icon-152x152.png
│   │       ├── chat_logo.png
│   │       ├── favicon-16x16.png
│   │       ├── favicon-32x32.png
│   │       ├── logo-192x192.png
│   │       └── logo-512x512.png
│   ├── index.html
│   └── manifest.json // PWA设置文件
├── src
│   ├── App.vue // 主文件入口
│   ├── api // 接口
│   │   ├── config.js // 请求接口配置文件
│   │   ├── data.js // 所有关于数据的接口
│   │   └── service.js // 所有关于服务业务的接口
│   ├── assets
│   │   ├── icon // 项目打包的icon资源目录
│   │   ├── image // 项目一些图片目录
│   │   └── style
│   │       └── global.scss // 全局的scss样式
│   ├── components // 组件
│   │   ├── Icon.vue // 图标组件
│   │   ├── common
│   │   │   ├── Empty.vue // 空白页组件
│   │   │   └── Loading.vue // 页面加载组件
│   │   ├── fragment
│   │   │   ├── ChatList.vue // 聊天列表容器
│   │   │   ├── ChatListCell.vue // 通用列表的组件
│   │   │   ├── ChatListItem.vue // 首页聊天列表的每个条目
│   │   │   ├── ChatRoom.vue // 聊天室
│   │   │   ├── ChatRoomItem.vue // 聊天室内的消息组件
│   │   │   ├── Failure.vue // 失败提示组件
│   │   │   ├── FormBased.vue
│   │   │   ├── FormVerify.vue
│   │   │   └── Success.vue // 成功提示组件
│   │   ├── layout // 布局组件
│   │   │   ├── Navigation.vue // 布局 - 导航栏
│   │   │   ├── RouteTransition.vue // 布局 - 切换路由动效
│   │   │   ├── Tabbar.vue // 布局 - tabbar
│   │   │   ├── TabbarContainer.vue // 布局 - tabbar 容器
│   │   │   └── TabbarItem.vue // 布局 - tabbar容器条目
│   │   └── packages // 各类打包组件（准备后期抽取）
│   │       ├── dialog
│   │       └── toast
│   ├── easychat.config.js // 针对此项目的配置总和（后期抽取成黑箱操作）
│   ├── layouts // 布局页面文件
│   │   ├── BasicLayout.vue // 基础布局
│   │   └── TabbarLayout.vue // tabbar布局
│   ├── main.js // 主入口
│   ├── registerServiceWorker.js // service-worker缓存
│   ├── router // 路由
│   │   └── index.js
│   ├── service // 业务层级（接口到页面的中间层）
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── register.js
│   │   └── user.js
│   ├── service-worker.js // service-worker
│   ├── socket // socket 服务器相关事件
│   │   ├── chatRoom.js
│   │   ├── createSyncEvents.js
│   │   └── socketIo.js
│   ├── store // 数据模型store模块
│   │   ├── index.js
│   │   └── modules
│   │       ├── badge.js // 所有小红点的数据仓库
│   │       ├── chat.js // 聊天数据仓库
│   │       ├── contacts.js // 通讯录数据仓库
│   │       ├── nav.js // 导航栏数据仓库
│   │       └── square.js // 广场聊天数据仓库
│   ├── utils // 工具类
│   │   ├── animate.js // 动画工具
│   │   ├── common.js // 通用
│   │   ├── next-transit-after.js // 路由切换动画的过渡钩子
│   │   ├── packet.js // socket传送包的构造器
│   │   ├── service-response-temp.js // 中间层的页面模板
│   │   ├── utils.js // 工具
│   │   └── validation.js // 校验格式
│   ├── vendor.js // 各类库的统一入口
│   └── views // 各个页面
│       ├── AddPeople
│       ├── Avatar
│       ├── Chat
│       ├── ChatSquare
│       ├── Contacts
│       ├── EasyChat
│       ├── Login
│       ├── Mine
│       ├── MineInfoEdit
│       ├── Register
│       ├── Setting
│       ├── Square
│       └── pages // 通用页面
│           ├── 404
│           │   └── NotFoundComponent.vue
│           ├── AddPeopleRequest.vue
│           ├── Auth.vue
│           ├── RegisterActive.vue
│           ├── RegisterResult.vue
│           ├── UserCard.vue
│           └── UserCardDetail.vue
└── vue.config.js // vue 设置
```



# License

[MIT](https://github.com/xdnloveme/easychat-web/blob/master/LICENSE)