async function addOrder (db, data) {
  const { _id, freightPrice = 14, payType = 4 } = data
  const _ = db.command
  const orderColl = db.collection('order')
  const cartColl = db.collection('cart')

  let cartData = await cartColl.doc(_id).get()
  cartData = cartData.data[0]

  // 获取购物车中被选中的数据
  const payInfo = cartData.cartInfo.filter((item) => {
    return item.isCheck
  })

  // 使用新的商品map
  const oldShopMap = cartData.shopMap[0]
  const newShop = {}
  payInfo.forEach(item => {
    newShop[item.venderId] = oldShopMap[item.venderId]
  })

  if (payInfo.length === 0) {
    return {
      code: -1,
      msg: '购物车中没有勾选物品'
    }
  }

  const orderId = Math.random().toString(36).substr(2)

  const orderData = {
    _id: orderId,
    dateSubmit: db.serverDate(),
    orderId,
    orderState: 1,
    ownerId: _id,
    payType,
    shopInfo: newShop,
    shouldPayPrice: cartData.totalPrice + freightPrice,
    skuInfoList: payInfo,
    cancelReasonText: '提交申请'
  }

  // 新插入订单
  await orderColl.add(orderData).catch(err => console.log(err))

  // 购物车中除移生成了订单的商品
  let newCartNum = 0
  let newCartShopMap = {}
  const newCartInfo = cartData.cartInfo.filter((item) => {
    if (!item.isCheck) {
      newCartShopMap[item.venderId] = oldShopMap[item.venderId]
      newCartNum += item.num
      return true
    }
    return false
  })

  await cartColl.doc(_id).update({
    cartInfo: newCartInfo,
    cartNum: newCartNum,
    shopMap: [newCartShopMap],
    totalPrice: 0
  })

  return {
    code: 0,
    msg: '成功生成订单',
    data: orderData
  }
}

exports.addOrder = addOrder
