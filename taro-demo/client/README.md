# TOPLIFE微信小程序

## 开发工具及技术选型

首先请阅读小程序[官方文档](https://mp.weixin.qq.com/debug/wxadoc/introduction/index.html)

需要安装[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)

本项目使用[京东多端开发解决方案](https://github.com/NervJS/taro)进行开发

数据流管理建议采用 `Redux`，配合 `@tarojs/redux` 来进行使用

## 开始开发

### 安装

首先需要安装[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)

将项目 clone 到本地

```bash
$ git clone git@git.jd.com:o2team-mall/toplife-weapp.git
```

接着需要安装 **京东多端开发解决方案开发工具**

```bash
$ yarn add global @tarojs/cli
```

随后进入项目目录安装项目依赖

```bash
$ cd toplife-weapp
$ yarn install
```

### 运行

在项目根目录下通过执行以下命令运行项目，同时在微信开发者工具中查看效果

```bash
$ taro build --type weapp --watch
```

### [产品相关文档及视觉稿git](http://git.jd.com/toplife/doc.git)

### 接口文档
- [api.tolife.com接口](http://cf.jd.com/display/WEB/TopLife)
- [魔法石接口](http://cf.jd.com/display/JDTG/Mstone+-+TopLife)
- [凤凰列表接口文档](http://cf.jd.com/pages/viewpage.action?pageId=90625400)

### 视觉稿
- 展示型页面-[http://3.cn/N4p6cKq](http://3.cn/N4p6cKq)
- 全站搜索-[http://3.cn/LdD7Wua](http://3.cn/LdD7Wua)
- 下单页-[http://3.cn/BejhEPh](http://3.cn/BejhEPh)
- 开票流程-[http://3.cn/OpzytJM](http://3.cn/OpzytJM)
- 购物车-[http://3.cn/2u5noZX](http://3.cn/2u5noZX)
- 购物车-[http://3.cn/5PXOcjj](http://3.cn/5PXOcjj)
- 订单中心-[http://3.cn/RvNYNol](http://3.cn/RvNYNol)
- 店铺页-[http://3.cn/jD5T6ug](http://3.cn/jD5T6ug)


店铺子页的链接为：http://mbeta.toplife.com/subShop.html?id=631


## 开普勒小程序

开普勒小程序在分支`feature_kepler`

从开普勒fork过来的仓库是`http://git.jd.com/o2team-mall/mpFactory.git`，其[文档](http://git.jd.com/MP_FE/mpFactory/wikis/home)

上传的模板的仓库是`http://git.jd.com/huangli47/toplife_build.git`

工具 [Asamblea](http://git.jd.com/MP_FE/mpFactory/wikis/Asamblea小程序组装工具使用说明)

他们的关系是：

Taro编译分支`feature_kepler`后，手工复制dist目录里的内容到mpFactory下的toplife文件夹里，使用Asamblea工具命令行
``` bash
$ jnpm run asam build toplife
$ jnpm run asam watch toplife
```
生成的文件夹`toplife_build`，该文件夹内容上传到toplife_build仓库，方便测试下载测试。

模板开发权限需要找`唐钱荣`

开发完成后，点击开发者工具`上传`即可上传模板到开普勒平台，而后通知产品让产品设置模版。

由于开普勒域名较少，做了域名转发：
<table>
<tr><td>环境</td><td>转发域名</td><td>转发规则</td><td>对应域名</td></tr>
<tr><td>线上</td><td>wxapp.m.jd.com</td><td>toplife</td><td>http://api-xcx-in.toplife.com</td></tr>
<tr><td>线上</td><td>wxapp.m.jd.com</td><td>mstone</td><td>http://mstone-api.jd.local</td></tr>
<tr><td>预发</td><td>wxappbeta.m.jd.com</td><td>toplife-beta</td><td>http://api-yf.toplife.com</td></tr>
<tr><td>预发</td><td>wxappbeta.m.jd.com</td><td>mstone-beta</td><td>http://mstone-api-top.jd.local</td></tr>
</table>


### 更新
#### 2.2.5
需求 2.5

a.分享优化

b.列表ui优化


1、[新增]埋点场景上报

2、[新增]商品图长图+方图共存

3、[新增]购物车和结算页清单页增加自营logo

4、[bug]购物车出现自营商品不显示

5、[bug]取消默认地址无效（修改后同app不放取消默认地址入口）

6、[优化]活动页面有签到时才会询问授权

7、[bug] 404页面时点击home键退出微信，再次进入倒计时静止不动

8、[优化]发票页返回自动收起编辑框

9、[bug]魔法石页面商品楼层偶发不对齐

10、[优化]视频播放页面，非全屏模式下，向上滑动一下页面，播放页面底部会留白显示

11、[优化]发票页面删除手机号，返回再进入有缓存

12、[bug]店铺的图片组件之间会存在间隙

13、[]bug]新建地址页面，其他输入正确，所在地区不输入，点击保存，接口提示参数不对

#### 2.2.6

- [新增] 商品详情页自营商品特殊处理
- [bug] 商详页面，切换商品属性，若接口返回没有此属性商品信息，页面会一直显示加载中
- [bug] 切换地址到四线城市导致配送时间不可选

#### 2.2.7

- 支付方式优化
- 优惠券