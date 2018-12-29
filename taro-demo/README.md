# Taro商城demo

本demo的多端适配状态如下：

- 微信小程序端 --- 后台使用小程序云，已适配
- H5端 --- 后台使用leancloud，已适配
- RN端 --- 后台使用leancloud，适配进行中
- 支付宝小程序端 --- 适配进行中
- 百度小程序端 --- 适配进行中



### 关于云开发

文章中的几个数据集的模拟数据，已上传至`cloud/doc`中，可根据需要自行导入。不过购物车，订单类的数据与openId相关联，所以更多的是可以参考其数据结构。

云函数的代码存放在`cloud/functions`中，小册并没有针对此部分进行过多的解读。代码是按模块进行分割，每个模块有一个入口文件和一些执行具体逻辑的文件。各位读者可自行阅读源码进行参考。



### 关于云函数

在使用你自己的云函数环境时，需要将云函数初始化换成你小程序的云环境。有以下几个地方需要注意：

- `src/app.js`
- `cloud/functions` 下**每个云函数**里的 `index.js`
- `project.config.json` 里的appid需要换成你的小程序的appid

```javascript
// src/app.js

async componentWillMount () {
  if (process.env.TARO_ENV === 'weapp') {
    wx.cloud.init({
      env: 'taro-ebook-23bbcb', // 换成你的云函数环境
      traceUser: true // 是否要捕捉每个用户的访问记录。设置为true，用户可在管理端看到用户访问记录
    })
    const userData = await getWxUserData()
    setGlobalData('userData', userData)
  }
}

```

```javascript
// 例： cloud/functions/cart/index.js

const app = require('tcb-admin-node')

const { getCart } = require('./getCart.js')
const { editCart } = require('./editCart.js')

app.init({
  envName: 'taro-ebook-23bbcb',   // 换成你的云函数环境
  mpAppId: 'wx9504f077bdc24ea2'   // 换成你的小程序id
})
```

另外，还有值得注意的，本demo在开发的时候，云函数的依赖包是 `tcb-admin-node` ，现在官方文档已改为 `wx-server-sdk`。不过亲测使用 `tcb-admin-node` 依旧能跑通，每个云函数都需要安装依赖后全量上传。