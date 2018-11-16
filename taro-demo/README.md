#  图像AI 小程序案例

## 配置小程序 id

```javascript
// project.config.json
{
    "appid": "",
}
```

## 配置环境 id

如果不填，则表示使用默认环境
```javascript
// client/app.js

wx.cloud.init({
    env: '', // 前往云控制台获取环境id
    traceUser: true
});
```

## 配置云函数 AppId, SecretId 和 SecretKey

```javascript
// 安装依赖
cd cloud/functions/idcard/
npm install --production

//cloud/functions/idcard/index.js
// 前往此处获取: https://console.cloud.tencent.com/cam/capi
let AppId = ''; // 腾讯云 AppId
let SecretId = ''; // 腾讯云 SecretId
let SecretKey = ''; // 腾讯云 SecretKey
```

## 上传云函数
在IDE中，右键云函数对应的文件夹，点击“上传并部署”菜单

## 体验
点击小程序开发IDE中的“预览”，用微信扫一扫即可体验