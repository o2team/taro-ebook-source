import Taro from '@tarojs/taro'
import { createAction } from 'redux-actions'

import {
  REQUEST_CART,
  RECEIVE_CART,
  REQUEST_DEL_CART,
  RECEIVE_DEL_CART,
  REQUEST_CHANGE_NUM,
  RECEIVE_CHANGE_NUM,
  REQUEST_CHECK_CART,
  RECEIVE_CHECK_CART,
  REQUEST_INVERSE_CHECK,
  RECEIVE_INVERSE_CHECK,
  REQUEST_CHANGE_ATTR,
  RECEIVE_CHANGE_ATTR,
  CHECK_DEL,
  INVERSE_CHECK_DEL,
  SHOW_ATTR_BOX,
  HIDE_ATTR_BOX,
  CHANGE_EDIT_STATUS,
  operate
} from '../constants/cart'

import { parseMoney } from '../utils/util'
import { getOpenId, getH5UniqueId } from '../utils/index'

const aMap = {
  REQUEST_CART: createAction(REQUEST_CART, datas => datas),
  RECEIVE_CART: createAction(RECEIVE_CART, datas => datas),
  REQUEST_DEL_CART: createAction(REQUEST_DEL_CART, datas => datas),
  RECEIVE_DEL_CART: createAction(RECEIVE_DEL_CART, datas => datas),
  REQUEST_CHANGE_NUM: createAction(REQUEST_CHANGE_NUM, datas => datas),
  RECEIVE_CHANGE_NUM: createAction(RECEIVE_CHANGE_NUM, datas => datas),
  REQUEST_CHECK_CART: createAction(REQUEST_CHECK_CART, datas => datas),
  RECEIVE_CHECK_CART: createAction(RECEIVE_CHECK_CART, datas => datas),
  REQUEST_INVERSE_CHECK: createAction(REQUEST_INVERSE_CHECK, datas => datas),
  RECEIVE_INVERSE_CHECK: createAction(RECEIVE_INVERSE_CHECK, datas => datas),
  REQUEST_CHANGE_ATTR: createAction(REQUEST_CHANGE_ATTR, datas => datas),
  RECEIVE_CHANGE_ATTR: createAction(RECEIVE_CHANGE_ATTR, datas => datas),
  CHECK_DEL: createAction(CHECK_DEL, datas => datas),
  INVERSE_CHECK_DEL: createAction(INVERSE_CHECK_DEL, datas => datas),
  HIDE_ATTR_BOX: createAction(HIDE_ATTR_BOX, datas => datas),
  SHOW_ATTR_BOX: createAction(SHOW_ATTR_BOX, datas => datas),
  CHANGE_EDIT_STATUS: createAction(CHANGE_EDIT_STATUS, datas => datas)
}

export function fetchCart () {
  return async (dispatch, getState) => {
    dispatch(aMap[REQUEST_CART]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'cart',
        data: {
          func: 'getCart',
          data: {
            _id: _openId
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_CART](getState().cart))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const getCart = require('../leancloud/cart/getCart').getCart
      res = await getCart(h5Id)
    }
    const data = res.result.data
    if (data.length !== 0) {
      const cartData = handleCartData(data)
      dispatch(aMap[RECEIVE_CART](cartData))
    } else {
      dispatch(aMap[RECEIVE_CART](getState().cart))
      data.code !== 3 && Taro.showToast({
        icon: 'none',
        title: '服务器繁忙'
      })
    }
  }
}

export function fetchChangeCartNum (skus) {
  return async (dispatch, getState) => {
    dispatch(aMap[REQUEST_CHANGE_NUM]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'cart',
        data: {
          func: 'editCart',
          data: {
            _id: _openId,
            type: operate['CHANGE_NUM'],
            skus
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_CHANGE_NUM](getState().cart))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const editCart = require('../leancloud/cart/editCart').editCart
      const editData = {
        h5Id,
        type: operate['CHANGE_NUM'],
        skus
      }
      res = await editCart(editData)
    }
    const data = res.result.data
    if (data.length !== 0) {
      const cartData = handleCartData(data)
      dispatch(aMap[RECEIVE_CHANGE_NUM](cartData))
    } else {
      dispatch(aMap[RECEIVE_CHANGE_NUM](getState().cart))
      data.code !== 3 && Taro.showToast({
        icon: 'none',
        title: '服务器繁忙'
      })
    }
  }
}

export function fetchCheckCart (skus) {
  return async (dispatch, getState) => {
    dispatch(aMap[REQUEST_CHECK_CART]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'cart',
        data: {
          func: 'editCart',
          data: {
            _id: _openId,
            type: operate['CHECK'],
            skus
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_CHECK_CART](getState().cart))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const editCart = require('../leancloud/cart/editCart').editCart
      const editData = {
        h5Id,
        type: operate['CHECK'],
        skus
      }
      res = await editCart(editData)
    }
    const data = res.result.data
    if (data.length !== 0) {
      const cartData = handleCartData(data)
      dispatch(aMap[RECEIVE_CHECK_CART](cartData))
    } else {
      dispatch(aMap[RECEIVE_CHECK_CART](getState().cart))
      data.code !== 3 && Taro.showToast({
        icon: 'none',
        title: '服务器繁忙'
      })
    }
  }
}

export function fetchInvertCheckCart (skus) {
  console.log(234234)
  return async (dispatch, getState) => {
    console.log(skus)
    dispatch(aMap[REQUEST_INVERSE_CHECK]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'cart',
        data: {
          func: 'editCart',
          data: {
            _id: _openId,
            type: operate['INVERT_CHECK'],
            skus
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_INVERSE_CHECK](getState().cart))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const editCart = require('../leancloud/cart/editCart').editCart
      const editData = {
        h5Id,
        type: operate['INVERT_CHECK'],
        skus
      }
      res = await editCart(editData)
    }
    const data = res.result.data
    if (data.length !== 0) {
      const cartData = handleCartData(data)
      dispatch(aMap[RECEIVE_INVERSE_CHECK](cartData))
    } else {
      dispatch(aMap[RECEIVE_INVERSE_CHECK](getState().cart))
      data.code !== 3 && Taro.showToast({
        icon: 'none',
        title: '服务器繁忙'
      })
    }
  }
}

export function fetchDelCart (skus) {
  return async (dispatch, getState) => {
    dispatch(aMap[REQUEST_DEL_CART]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'cart',
        data: {
          func: 'editCart',
          data: {
            _id: _openId,
            type: operate['DEL'],
            skus
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_DEL_CART](getState().cart))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const editCart = require('../leancloud/cart/editCart').editCart
      const editData = {
        h5Id,
        type: operate['DEL'],
        skus
      }
      res = await editCart(editData)
    }
    const data = res.result.data
    if (data.length !== 0) {
      const cartData = handleCartData(data)
      dispatch(aMap[RECEIVE_DEL_CART](cartData))
    } else {
      dispatch(aMap[RECEIVE_DEL_CART](getState().cart))
      data.code !== 3 && Taro.showToast({
        icon: 'none',
        title: '服务器繁忙'
      })
    }
  }
}

export function fetchChangeAttr (sku) {
  return async (dispatch, getState) => {
    dispatch(aMap[REQUEST_CHANGE_ATTR]())
    let res
    if (process.env.TARO_ENV === 'weapp') {
      const _openId = await getOpenId()
      res = await wx.cloud.callFunction({
        name: 'cart',
        data: {
          func: 'editCart',
          data: {
            _id: _openId,
            type: operate['CHANGE_ATTR'],
            skus: sku
          }
        }
      }).catch(err => {
        console.log(err)
        dispatch(aMap[RECEIVE_CHANGE_ATTR](getState().cart))
      })
    } else if (process.env.TARO_ENV === 'h5' || 'rn') {
      const h5Id = await getH5UniqueId()
      const editCart = require('../leancloud/cart/editCart').editCart
      const editData = {
        h5Id,
        type: operate['CHANGE_ATTR'],
        skus: sku
      }
      res = await editCart(editData)
    }
    const data = res.result.data
    if (data.length !== 0) {
      const cartData = handleCartData(data)
      dispatch(aMap[RECEIVE_CHANGE_ATTR](cartData))
    } else {
      dispatch(aMap[RECEIVE_CHANGE_ATTR](getState().cart))
      data.code !== 3 && Taro.showToast({
        icon: 'none',
        title: '服务器繁忙'
      })
    }
  }
}

export function showEditBox (sku) {
  return (dispatch, getState) => {
    const { editSkuData } = getState().cart
    let newEditSkuData = {
      ...editSkuData,
      sku,
      showEidtBox: true
    }
    dispatch(aMap[SHOW_ATTR_BOX]({
      editSkuData: newEditSkuData
    }))
  }
}

export function hideEditBox () {
  return (dispatch, getState) => {
    const { editSkuData } = getState().cart
    let newEditSkuData = {
      ...editSkuData,
      showEidtBox: false
    }
    dispatch(aMap[HIDE_ATTR_BOX]({
      editSkuData: newEditSkuData
    }))
  }
}

export function changeEditStatus (boolean) {
  return (dispatch) => {
    const isEditStatus = boolean
    dispatch(aMap[CHANGE_EDIT_STATUS]({isEditStatus}))
  }
}

export function changeCouponStatus (boolean) {
  return (dispatch, getState) => {
    const { couponData } = getState().cart
    let newCouponData = {
      ...couponData,
      showCouponList: boolean
    }
    dispatch(aMap[CHANGE_COUPON_STATUS]({
      couponData: newCouponData
    }))
  }
}

export function checkDelCart (delSkus) {
  return (dispatch, getState) => {
    const { commoditys } = getState().cart
    let commoditysCheckDelAll = true
    for (let commodity of commoditys) {
      const { shop, skus } = commodity
      let checkDelAll = true
      skus.forEach(sku => {
        const isChoose = delSkus.filter(delSku => { return delSku.skuId === sku.skuId }).length !== 0
        // 是否处于选中态
        if (isChoose) sku.checkDel = true
        if (!sku.checkDel) checkDelAll = false
      })
      shop.checkDelAll = checkDelAll
      if (!shop.checkDelAll) commoditysCheckDelAll = false
    }
    // 返回新的数组
    const newCommoditys = commoditys.slice(0)

    dispatch(aMap[CHECK_DEL]({
      commoditys: newCommoditys,
      checkDelAll: commoditysCheckDelAll
    }))
  }
}

export function inverseCheckDelCart (delSkus) {
  return (dispatch, getState) => {
    const { commoditys } = getState().cart
    let commoditysCheckDelAll = true
    for (let commodity of commoditys) {
      const { shop, skus } = commodity
      let checkDelAll = true
      skus.forEach(sku => {
        const isChoose = delSkus.filter(delSku => { return delSku.skuId === sku.skuId }).length !== 0
        // 是否处于删除态
        if (isChoose) sku.checkDel = false
        if (!sku.checkDel) checkDelAll = false
      })
      shop.checkDelAll = checkDelAll
      if (!shop.checkDelAll) commoditysCheckDelAll = false
    }
    // 返回新的数组
    const newCommoditys = commoditys.slice(0)

    dispatch(aMap[INVERSE_CHECK_DEL]({
      commoditys: newCommoditys,
      checkDelAll: commoditysCheckDelAll
    }))
  }
}

// 将拿到的数据进行处理，方便前端展示
function handleCartData (data) {
  if (!data || !data.cartInfo) {
    return {
      commoditys: [],
      offSales: [],
      checkCartNum: 0,
      totalPrice: 0,
      checkAll: false
    }
  }

  const commoditysObj = {}
  let commoditys = []
  const offSales = []
  let checkCartNum = 0
  let totalPrice = 0
  let checkAll = true

  const { cartInfo, shopMap } = data
  const realShopMap = shopMap[0]

  // 结算总价格
  totalPrice = parseMoney(data.totalPrice)

  for (let venderId in realShopMap) {
    // 整理店铺的信息
    let toplifeShop = {
      fullLogoUri: 'https://img11.360buyimg.com/ling/jfs/t24292/40/1063566259/5338/454eb23d/5b4f2575N485ac2d0.jpg',
      logoUri: '/ling/jfs/t24292/40/1063566259/5338/454eb23d/5b4f2575N485ac2d0.jpg',
      title: 'TARO',
      venderId: ''
    }
    let shopObj = realShopMap[venderId] || toplifeShop
    // 店铺是否全选
    shopObj.checkAll = true
    // 店铺是否显示全选这个标题，有无货商品时不显示
    shopObj.showCheckAll = false
    // 店铺是否全选删除
    shopObj.checkDelAll = false

    let commodityObj = {}
    commodityObj.shop = shopObj
    commodityObj.skus = []

    commoditysObj[venderId] = commodityObj
  }

  // 整理商品的信息
  cartInfo.forEach((item) => {
    const venderId = item.venderId
    const skusObj = commoditysObj[venderId].skus
    const shopObj = commoditysObj[venderId].shop

    // 显示全选
    shopObj.showCheckAll = true

    let obj = {}
    obj.skuId = item.skuId
    obj.num = item.num
    obj.main = item.info
    obj.isCheck = item.isCheck
    obj.colorInfo = item.info.colorInfo
    obj.sizeInfo = item.info.sizeInfo
    // 商品是否选中删除
    obj.checkDel = false

    // 增加商品数量
    obj.isCheck && (checkCartNum += obj.num)

    // 商品是否无货
    obj.isOutOfStock = false

    // 是否全选
    if (!obj.isCheck) shopObj.checkAll = false

    if (!shopObj.checkAll) checkAll = false

    skusObj.push(obj)
  })

  checkCartNum > 99 && (checkCartNum = '99+')

  commoditys = Object.values(commoditysObj)

  return {
    commoditys,
    offSales,
    checkCartNum,
    totalPrice,
    checkAll
  }
}
