import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await'
import configStore from './store'
import Index from './pages/index'

import { setGlobalData } from './constants/globalData'
import { getWxUserData } from './utils/wx'

import './app.scss'

const store = configStore()

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/shop/shop',
      'pages/user/order/list/list',
      'pages/user/order/detail/detail',
      'pages/cart/cart',
      'pages/cart/cart_sub',
      'pages/detail/detail',
      'pages/list/list',
      'pages/balance/balance'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: 'TARO商城',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: '#7b7b7a',
      selectedColor: '#c0a369',
      backgroundColor: '#222222',
      list: [
        {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'asset/home.png',
        selectedIconPath: 'asset/home_active.png'
      },{
        pagePath: 'pages/cart/cart',
        text: '购物车',
        iconPath: 'asset/shoppingbag.png',
        selectedIconPath: 'asset/shoppingbag_active.png'
      }, {
        pagePath: 'pages/user/order/list/list',
        text: '订单',
        iconPath: 'asset/mine.png',
        selectedIconPath: 'asset/mine_active.png'
      }]
    },
    cloud: true,
    networkTimeout: {
      request: 6000,
      connectSocket: 10000,
      uploadFile: 10000,
      downloadFile: 10000
    }
  }

  constructor () {
    super(...arguments)
  }

  async componentWillMount () {
    if (process.env.TARO_ENV === 'weapp') {
      wx.cloud.init({
        env: 'taro-ebook-23bbcb', // 前往云控制台获取环境id
        traceUser: true // 是否要捕捉每个用户的访问记录。设置为true，用户可在管理端看到用户访问记录
      })
      const userData = await getWxUserData()
      setGlobalData('userData', userData)
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
