const AV = require('../index').default
const { typeMap, getNewCartData } = require('./utils')

function changCartNum (oldCartInfo, skus) {
  // 更新购物车中的商品数据
  const newCartInfo = oldCartInfo.map((item) => {
    const temp = skus.filter(sku => item.skuId === sku.skuId)[0]
    if (temp) {
      item.num = temp.num
      item.isCheck = true
    }
    return item
  })
  
  return newCartInfo
}

function addCart (oldCartInfo, skus) {
  skus.forEach((sku) => { sku.isCheck = true })
  let spliceIdx
  // 更新购物车中的商品数据
  let newCartInfo = oldCartInfo.map((item) => {
    const temp = skus.filter((sku, idx) => {
      if (item.skuId === sku.skuId) {
        spliceIdx = idx
        return true
      }
    })[0]
    if (temp) {
      skus.splice(spliceIdx, 1)
      item.num += temp.num
      item.isCheck = temp.isCheck
      item.size = temp.size
      item.color = temp.color
    }

    return item
  })

  return newCartInfo.concat(skus)
}

function delCart (oldCartInfo, skus) {
  const newCartInfo = oldCartInfo.filter((item) => {
    const temp = skus.filter(sku => { return item.skuId === sku.skuId })[0]
    return !temp
  })

  return newCartInfo
}

function checkCart (oldCartInfo, skus) {
  // 更新购物车中的商品数据
  const newCartInfo = oldCartInfo.map((item) => {
    const temp = skus.filter(sku => item.skuId === sku.skuId)[0]
    if (temp) {
      item.isCheck = true
    }
    return item
  })

  return newCartInfo
}

function inverseCheckCart (oldCartInfo, skus) {
  // 更新购物车中的商品数据
  const newCartInfo = oldCartInfo.map((item) => {
    const temp = skus.filter(sku => item.skuId === sku.skuId)[0]
    if (temp) {
      item.isCheck = false
    }
    return item
  })

  return newCartInfo
}

function changeAttr (oldCartInfo, skus) {
  // 更新购物车中的商品数据
  const newCartInfo = oldCartInfo.map((item) => {
    const temp = skus.filter(sku => item.skuId === sku.skuId)[0]
    if (temp) {
      item.info.colorInfo.value = temp.color
      item.info.sizeInfo.value = temp.size
    }
    return item
  })

  return newCartInfo
}

async function editCart (data) {
  const { h5Id, skus, type } = data
  const CartQuery = new AV.Query('Cart')

  // 补存num字段
  skus.forEach((sku) => {
    sku.skuId = sku.skuId + ''
    if(!sku.num) { sku.num = 1 }
  })

  // 获取当前购物车
  CartQuery.equalTo('h5Id', h5Id)
  CartQuery.select(['cartInfo', 'shopMap'])
  const findRes = await CartQuery.find()
  const cartRes = findRes[0].toJSON()
  const shopMap = cartRes.shopMap[0]
  const oldCartInfo = cartRes.cartInfo
  const cartObjectId = cartRes.objectId
  let newCartInfo

  // 根据type进行相应的购物车操作
  switch (type) {
    case typeMap['CHANGE_NUM']:
      newCartInfo = changCartNum(oldCartInfo, skus)
      break
    case typeMap['ADD']:
      newCartInfo = addCart(oldCartInfo, skus)
      break
    case typeMap['DEL']:
      newCartInfo = delCart(oldCartInfo, skus)
      break
    case typeMap['CHECK']:
      newCartInfo = checkCart(oldCartInfo, skus)
      break
    case typeMap['INVERT_CHECK']:
      newCartInfo = inverseCheckCart(oldCartInfo, skus)
      break
    case typeMap['CHANGE_ATTR']:
      newCartInfo = changeAttr(oldCartInfo, skus)
      break
    default:
      break
  }

  // 得到新的购物车数据
  const cartData = await getNewCartData({cartInfo: newCartInfo, shopMap})
  // 更新数据
  const newCart = AV.Object.createWithoutData('Cart', cartObjectId)
  for (let key in cartData) {
    newCart.set(key, cartData[key])
  }
  await newCart.save()

  return { result: { data: cartData }}
}

exports.editCart = editCart
