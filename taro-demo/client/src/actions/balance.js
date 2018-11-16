import Taro from '@tarojs/taro'
import { createAction } from 'redux-actions'

import {
  REQUEST_BALANCE_INFO,
  RECEIVE_BALANCE_INFO,
  REQUEST_BALANCE_ORDER,
  RECEIVE_BALANCE_ORDER
} from '../constants/balance'

import { getOpenId, getH5UniqueId } from '../utils/index'


const aMap = {
  REQUEST_BALANCE_INFO: createAction(REQUEST_BALANCE_INFO, datas => datas),
  RECEIVE_BALANCE_INFO: createAction(RECEIVE_BALANCE_INFO, datas => datas),
  REQUEST_BALANCE_ORDER: createAction(REQUEST_BALANCE_ORDER, datas => datas),
  RECEIVE_BALANCE_ORDER: createAction(RECEIVE_BALANCE_ORDER, datas => datas)
}

export function fetchBalanceData () {
  return async (dispatch, getState) => {
    Taro.showLoading({ title: '加载中...' })
    dispatch(aMap[REQUEST_BALANCE_INFO]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'order',
        data: {
          func: 'getBalance',
          data: {
            _id: _openId
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_BALANCE_INFO](getState().balance))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const getBalance = require('../leancloud/order/getBalance').getBalance
      res = await getBalance({h5Id})
    }
    Taro.hideLoading()
    const data = res.result.data
    if (data.length !== 0) {
      const balanceData = handleBalanceData(data)
      dispatch(aMap[RECEIVE_BALANCE_INFO](balanceData))
    } else {
      dispatch(aMap[RECEIVE_BALANCE_INFO](getState().balance))
      Taro.showToast({
        icon: 'none',
        title: '请求失败'
      })
    }
  }
}

export function fetchGenerateOrder (freightPrice, payType, callback) {
  return async (dispatch, getState) => {
    Taro.showLoading({ title: '加载中...' })
    dispatch(aMap[REQUEST_BALANCE_ORDER]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'order',
        data: {
          func: 'addOrder',
          data: {
            _id: _openId,
            freightPrice,
            payType
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_BALANCE_ORDER](getState().balance))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const addOrder = require('../leancloud/order/addOrder').addOrder
      res = await addOrder({
        h5Id,
        freightPrice,
        payType
      })
    }

    Taro.hideLoading()
    const data = res.result.data
    if (data.code === 0) {
      dispatch(aMap[RECEIVE_BALANCE_ORDER]())
      callback && callback(data)
    } else {
      dispatch(aMap[RECEIVE_BALANCE_ORDER](getState().balance))
      Taro.showToast({
        icon: 'none',
        title: '请求失败'
      })
    }
  }
}

// 将拿到的数据进行处理，方便前端展示
function handleBalanceData(data) {
  if (!data || !data.payInfo) {
    return {
      isNeedBanlance: true,
      payCommodities: [],
      payNum: 0,
      totalPrice: 0
    }
  }

  const commoditysObj = {}
  let payCommodities = []
  let payNum = 0
  let totalPrice = 0

  const { payInfo, shopMap, isNeedBanlance } = data
  const realShopMap = shopMap[0]

  totalPrice = data.totalPrice

  for (let venderId in realShopMap) {
    // 整理店铺的信息
    let toplifeShop = {
      fullLogoUri: 'https://img11.360buyimg.com/ling/jfs/t24292/40/1063566259/5338/454eb23d/5b4f2575N485ac2d0.jpg',
      logoUri: '/ling/jfs/t24292/40/1063566259/5338/454eb23d/5b4f2575N485ac2d0.jpg',
      title: 'TARO',
      venderId: ''
    }
    let shopObj = realShopMap[venderId] || toplifeShop

    let commodityObj = {}
    commodityObj.shop = shopObj
    commodityObj.skus = []

    commoditysObj[venderId] = commodityObj
  }

  // 整理商品的信息
  payInfo.forEach((item) => {
    const venderId = item.venderId
    const skusObj = commoditysObj[venderId].skus

    let obj = {}
    obj.skuId = item.skuId
    obj.num = item.num
    obj.main = item.info
    obj.colorInfo = item.info.colorInfo
    obj.sizeInfo = item.info.sizeInfo

    // 增加商品数量
    payNum += obj.num

    skusObj.push(obj)
  })

  for (let venderId in commoditysObj) {
    const commodities = commoditysObj[venderId]
    if (commodities.skus.length !== 0) {
      payCommodities.push(commodities)
    }
  }

  payNum > 99 && (payNum = '99+')

  return {
    payCommodities,
    isNeedBanlance,
    payNum,
    totalPrice
  }
}
