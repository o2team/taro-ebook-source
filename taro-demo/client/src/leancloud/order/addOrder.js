import AV from '../index'

async function addOrder (data) {
  const { h5Id, freightPrice = 14, payType = 4 } = data
  let returnData
  const CartQuery = new AV.Query('Cart')

  const Order = AV.Object.extend('Order')

  CartQuery.equalTo('h5Id', h5Id)
  const res = await CartQuery.find()
  const cartData = res[0].toJSON()
  const cartObjectId = cartData.objectId

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
    returnData = {
      code: -1,
      msg: '购物车中没有勾选物品'
    }
  }

  const orderId = Math.random().toString(36).substr(2)

  const orderData = {
    dateSubmit: new Date().toString(),
    orderId,
    orderState: 1,
    ownerId: h5Id,
    payType,
    shopInfo: newShop,
    shouldPayPrice: cartData.totalPrice + freightPrice,
    skuInfoList: payInfo,
    cancelReasonText: '提交申请'
  }

  // 新插入订单
  const orderItem = new Order()
  for (let key in orderData) {
    orderItem.set(key, orderData[key])
  }
  await orderItem.save().catch(err => console.log(err))

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

  // 更新数据
  const newCart = AV.Object.createWithoutData('Cart', cartObjectId)
  newCart.set('cartInfo', newCartInfo)
  newCart.set('cartNum', newCartNum)
  newCart.set('shopMap', [newCartShopMap])
  newCart.set('totalPrice', 0)
  await newCart.save()

  returnData = {
    code: 0,
    msg: '成功生成订单',
    data: orderData
  }

  return { result: { data: returnData } } 
}

exports.addOrder = addOrder
