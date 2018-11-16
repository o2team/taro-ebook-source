import Taro from '@tarojs/taro'
import { createAction } from 'redux-actions'

import {
  REQUEST_SHOP,
  RECEIVE_SHOP
} from '../constants/shop'

export const actionMap = {
  shopRequest: createAction(REQUEST_SHOP),
  shop: createAction(RECEIVE_SHOP, (data) => data)
}

export function fetchShopData (data) {
  const venderId = data.venderId
  return async dispatch => {
    try {
      dispatch(actionMap['shopRequest']())
      let res
      if (process.env.TARO_ENV === 'weapp') {
        res = await wx.cloud.callFunction({
          name: 'shop',
          data: {
            func: 'getShop',
            data: venderId
          }
        })
      } else if (process.env.TARO_ENV === 'h5' || 'rn') {
        const getShop = require('../leancloud/shop/getShop').getShop
        res = await getShop(venderId)
      }
      if (res.result) {
        let shopData = res.result.data
        dispatch(actionMap['shop'](shopData))
      } else {
        Taro.redirectTo({url: '/pages/404/404'})
      }
    } catch (err) {
      console.log(err)
      Taro.redirectTo({url: '/pages/404/404'})
    }
  }
}

// async function getShop (params) {
//   const db = wx.cloud.database()
//   const _ = db.command
//   const shopColl = db.collection('shop')
//   const res = await shopColl.get()
//   console.log(JSON.stringify(res.data, 4))
// }

// getShop()
