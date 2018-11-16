import Taro from '@tarojs/taro'
import { createAction } from 'redux-actions'

import { REQUEST_HOME, RECEIVE_HOME, RECEIVE_HOME_ERROR } from '../constants/home'

export const requestHome = createAction(REQUEST_HOME, () => null)
export const receiveHome = createAction(RECEIVE_HOME, (data) => data)
export const receiveHomeError = createAction(RECEIVE_HOME_ERROR, () => null)

export function fetchIndexList () {
  return async dispatch => {
    dispatch(requestHome())
    try {
      Taro.showNavigationBarLoading()
      let res
      if (process.env.TARO_ENV === 'weapp') {
        res = await wx.cloud.callFunction({
          name: 'shop',
          data: {
            func: 'getInformation'
          }
        })
      } else if (process.env.TARO_ENV === 'h5' || 'rn') {
        const getInformation = require('../leancloud/shop/getInformation').getInformation
        res = await getInformation()
      }
      if (res.result) {
        dispatch(receiveHome(res.result))
        Taro.hideNavigationBarLoading()
      } else {
        Taro.hideNavigationBarLoading()
        dispatch(receiveHomeError({}))
        await Taro.showToast({
          icon: 'none',
          title: '获取失败，请重试！'
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
}

function addshop () {
  const shops = [
    {
      "_id": "4",
      "banner": [
        "http://img20.360buyimg.com/ling/jfs/t1/5373/22/5202/707257/5b9f1e8aE219cdf19/bb17192e448bade7.jpg",
        "http://img14.360buyimg.com/ling/jfs/t1/460/5/5518/747242/5b9f1eb2Ed89cd28b/7787f2a49186610f.jpg",
        "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
        "http://img11.360buyimg.com/ling/jfs/t1/4629/4/5095/1714340/5b9f1f72E997695e5/4f56ca1a12642971.jpg!q60"
      ],
      "desc": "店铺4页面",
      "floors": [
        {
          "commodities": [
            4,
            6,
            1,
            2
          ],
          "desc": "http://img30.360buyimg.com/ling/jfs/t1/5083/21/5232/267378/5b9f2d78E8bcd381b/ff27135de4d8cf8c.jpg",
          "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
        },
        {
          "commodities": [
            1,
            2,
            5,
            3
          ],
          "desc": "http://img13.360buyimg.com/ling/jfs/t1/351/8/5598/360623/5b9f2d78E2ae9ff61/716a483125913fd9.jpg",
          "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
        }
      ],
      "thumbnail": "//img14.360buyimg.com/popshop/s190x80_jfs/t11023/223/1027006619/7985/c520a46c/5a379a4aN9d105368.png",
      "title": "店铺4",
      "venderId": 4
    },
    {
      "_id": "3",
      "banner": [
        "http://img20.360buyimg.com/ling/jfs/t1/5373/22/5202/707257/5b9f1e8aE219cdf19/bb17192e448bade7.jpg",
        "http://img14.360buyimg.com/ling/jfs/t1/460/5/5518/747242/5b9f1eb2Ed89cd28b/7787f2a49186610f.jpg",
        "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
        "http://img12.360buyimg.com/ling/jfs/t1/1501/21/5274/925976/5b9f2021E25bcf9e1/9850163290842937.jpg!q60"
      ],
      "desc": "店铺3页面",
      "floors": [
        {
          "commodities": [
            2,
            3,
            6,
            4
          ],
          "desc": "http://img30.360buyimg.com/ling/jfs/t1/5083/21/5232/267378/5b9f2d78E8bcd381b/ff27135de4d8cf8c.jpg",
          "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
        },
        {
          "commodities": [
            1,
            5,
            3,
            6
          ],
          "desc": "http://img10.360buyimg.com/ling/jfs/t1/1657/27/5346/245880/5b9f2d78E85f0c8c7/1dc51ecf4e25b6d0.jpg",
          "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
        }
      ],
      "thumbnail": "//img12.360buyimg.com/n1/s190x80_jfs/t22429/300/1109626640/5017/d77c7252/5b50350aNb53dba6c.png",
      "title": "店铺3",
      "venderId": 3
    },
    {
      "_id": "1",
      "banner": [
        "http://img14.360buyimg.com/ling/jfs/t1/460/5/5518/747242/5b9f1eb2Ed89cd28b/7787f2a49186610f.jpg",
        "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
        "http://img12.360buyimg.com/ling/jfs/t1/1501/21/5274/925976/5b9f2021E25bcf9e1/9850163290842937.jpg!q60",
        "http://img14.360buyimg.com/ling/jfs/t1/1826/38/5279/1690440/5b9f1f90Eecfa2c50/10051d297b94c29b.jpg!q60"
      ],
      "desc": "店铺1页面",
      "floors": [
        {
          "commodities": [
            1,
            2,
            3,
            4
          ],
          "desc": "http://img13.360buyimg.com/ling/jfs/t1/351/8/5598/360623/5b9f2d78E2ae9ff61/716a483125913fd9.jpg",
          "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
        },
        {
          "commodities": [
            1,
            3,
            4,
            5
          ],
          "desc": "http://img10.360buyimg.com/ling/jfs/t1/1657/27/5346/245880/5b9f2d78E85f0c8c7/1dc51ecf4e25b6d0.jpg",
          "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
        }
      ],
      "thumbnail": "//img10.360buyimg.com/popshop/s190x80_jfs/t16390/270/1887231446/24253/18756a28/5a72d454N18b1efc6.jpg",
      "title": "店铺1",
      "venderId": 1
    },
    {
      "_id": "2",
      "banner": [
        "http://img30.360buyimg.com/ling/jfs/t1/268/31/5534/1729274/5b9f1f14Eee5b2adf/8e74d65c03f3f9fd.jpg!q60",
        "http://img12.360buyimg.com/ling/jfs/t1/1501/21/5274/925976/5b9f2021E25bcf9e1/9850163290842937.jpg!q60",
        "http://img14.360buyimg.com/ling/jfs/t1/1826/38/5279/1690440/5b9f1f90Eecfa2c50/10051d297b94c29b.jpg!q60",
        "http://img20.360buyimg.com/ling/jfs/t1/5373/22/5202/707257/5b9f1e8aE219cdf19/bb17192e448bade7.jpg"
      ],
      "desc": "店铺2页面",
      "floors": [
        {
          "commodities": [
            3,
            1,
            2,
            5
          ],
          "desc": "http://img10.360buyimg.com/ling/jfs/t1/1657/27/5346/245880/5b9f2d78E85f0c8c7/1dc51ecf4e25b6d0.jpg",
          "title": "//img12.360buyimg.com/tuangou/s750x170_jfs/t15316/209/1136705664/8030/71099545/5a4626ebN8fea2205.png"
        },
        {
          "commodities": [
            1,
            3,
            2,
            7
          ],
          "desc": "http://img30.360buyimg.com/ling/jfs/t1/5083/21/5232/267378/5b9f2d78E8bcd381b/ff27135de4d8cf8c.jpg",
          "title": "//img10.360buyimg.com/tuangou/s750x170_jfs/t15328/270/809894122/7669/cc12bee5/5a38bbd7Nd9f338f0.png"
        }],
        "thumbnail": "//img10.360buyimg.com/popshop/s190x80_jfs/t17935/53/2369573223/24376/e2dd64/5af1b116N558ae2db.jpg",
        "title": "店铺2",
        "venderId": 2
    }]
  const db = wx.cloud.database()
  const shopColl = db.collection('shop')
  shops.forEach((item) => {
    const id = item._id
    delete item._id
    shopColl.doc(id).set({
      data: item
    })
  })
}

async function getSkus () {
  const db = wx.cloud.database()
  const CommoditiesColl = db.collection('commodity')
  const res = await CommoditiesColl.get()
  console.log(JSON.stringify(res.data))
}

// getSkus()
// addshop()
