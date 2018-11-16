import Taro from '@tarojs/taro'
import { createAction } from 'redux-actions'

import { parseMoney } from '../utils/util'
import { getOpenId, getH5UniqueId } from '../utils/index'

const orderMap = {
  orderList: 'ORDER_LIST',
  orderDetail: 'ORDER_DETAIL',
  orderCancel: 'ORDER_CANCEL'
}

export function request (type) {
  return createAction(`REQUEST_${orderMap[type]}`)()
}

export function receive (type, data) {
  return createAction(`RECEIVE_${orderMap[type]}`, data => data)(data)
}

export function fetchOrderList (callback) {
  return async (dispatch, getState) => {
    Taro.showLoading({title: '加载中...'})
    dispatch(request('orderList'))
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'order',
        data: {
          func: 'getOrder',
          data: {
            _id: _openId
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(receive('orderList', getState().orderList))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const getOrder = require('../leancloud/order/getOrder').getOrder
      res = await getOrder({h5Id})
      console.warn(res)
    }

    Taro.hideLoading()
    const data = res.result.data
    if (data.length !== 0) {
      const orderData = handleOrderData(data)
      dispatch(receive('orderList', orderData))
      if (callback) {
        callback(orderData)
      }
    } else {
      await Taro.showToast({
        icon: 'none',
        title: '请求失败，请重试！'
      })
    }
  }
}

export function fetchOrderById (orderId) {
  return async (dispatch, getState) => {
    Taro.showLoading({title: '加载中...'})
    dispatch(request('orderDetail'))
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'order',
        data: {
          func: 'getOrderDetail',
          data: {
            _id: _openId,
            orderId
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(receive('orderDetail', getState().orderDetail))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const getOrderDetail = require('../leancloud/order/getOrderDetail').getOrderDetail
      res = await getOrderDetail({h5Id, orderId})
    }
    Taro.hideLoading()
    const data = res.result.data
    if (data.length !== 0) {
      dispatch(receive('orderDetail', data))
    } else {
      await Taro.showToast({
        icon: 'none',
        title: '请求失败，请重试！'
      })
    }
  }
}

export function fetchCancelOrder (oData, callback) {
  return async (dispatch, getState) => {
    Taro.showLoading({title: '加载中...'})
    dispatch(request('orderCancel'))
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'order',
        data: {
          func: 'cancelOrder',
          data: {
            _id: _openId,
            orderId: oData.orderId,
            cancelReasonText: oData.cancelReasonText
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(receive('orderCancel', getState().orderDetail))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const cancelOrder = require('../leancloud/order/cancelOrder').cancelOrder
      res = await cancelOrder({cancelReasonText: oData.cancelReasonText, orderId: oData.orderId})
    }
    Taro.hideLoading()
    const data = res.result.data
    if (data.code === 0) {
      dispatch(receive('orderCancel'))
      callback && callback(data)
    } else {
      await Taro.showToast({
        icon: 'none',
        title: '请求失败，请重试！'
      })
    }
  }
}

// 将拿到的数据进行处理，方便前端展示
function handleOrderData (data) {
  const newOrderList = data.map(item => {
    const venderId = item.skuInfoList[0].venderId
    const newItem = {...item}
    newItem.shopInfo = {...newItem.shopInfo[venderId]}
    let totalGoodsCount = 0
    let isMulti = false
    newItem.skuInfoList.forEach(sku => {
      totalGoodsCount += sku.num
    })
    if (newItem.skuInfoList.length > 1) {
      isMulti = true
      newItem.skuInfoList.splice(2)
    } else {
      newItem.skuItem = newItem.skuInfoList[0]
    }
    newItem.isMulti = isMulti
    newItem.totalGoodsCount = totalGoodsCount
    newItem.statusClassName = 'orders_item_status'
    if (newItem.orderState === -1) {
      newItem.orderStateStr = '已取消订单'
      newItem.statusClassName = 'orders_item_status cancel'
    } else if (newItem.orderState === 1) {
      newItem.orderStateStr = '待支付'
      newItem.statusClassName = 'orders_item_status pay'
    }
    newItem.shouldPayPrice = parseMoney(newItem.shouldPayPrice)
    return newItem
  })

  return newOrderList
}
