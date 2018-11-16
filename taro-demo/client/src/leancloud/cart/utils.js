const AV = require('../index').default

const typeMap = {
  ADD: '2',
  CHANGE_NUM: '3',
  DEL: '4',
  CHECK: '5',
  INVERT_CHECK: '6',
  CHANGE_ATTR: '8'
}

async function getNewCartData ({cartInfo, shopMap}) {
  const ComQuery = new AV.Query('commodity')
  const ShopQuery = new AV.Query('shop')

  const newShopMap = {}
  const allCartInfoData = await Promise.all(cartInfo.map(async (item) => {
    let newItem = item

    // 如果没有商品的具体信息
    if (!item.info) {
      // 获得商品的具体信息
      ComQuery.equalTo('skuId', parseInt(item.skuId))
      let allItemData = await ComQuery.find()
      allItemData = allItemData[0].toJSON()

      // 加上venderId
      if (!item.venderId) { item.venderId = allItemData.venderId }
      item.venderId += ''

      // 更改尺寸
      if (item.size) {
        allItemData.sizeInfo.value = item.size
      }

      // 更改颜色
      if (item.color) {
        allItemData.colorInfo.value = item.color
      }

      // 判定是否被选中
      if (!item.isCheck) { item.isCheck = false }

      newItem = Object.assign({}, item, { info: allItemData })
    }

    // 获得商店的具体信息
    if (!newShopMap[newItem.venderId]) {
      // 先找下有没有缓存，不用再查数据库
      if (!shopMap[newItem.venderId]) {
        ShopQuery.equalTo('venderId', parseInt(newItem.venderId))
        ShopQuery.select(['thumbnail', 'title', 'venderId'])
        let shopInfo = await ShopQuery.find()
        shopInfo = shopInfo[0].toJSON()
        newShopMap[newItem.venderId] = shopInfo
      } else {
        newShopMap[newItem.venderId] = shopMap[newItem.venderId]
      }
    }
  
    return newItem
  }))

  const cartData = {
    cartNum: 0,
    totalPrice: 0,
    cartInfo: allCartInfoData,
    shopMap: [newShopMap]
  }

  allCartInfoData.forEach((item) => {
    cartData.cartNum += item.num
    if (item.isCheck) {
      cartData.totalPrice += item.num * parseInt(item.info.price)
    }
  })

  return cartData
}

module.exports = {
  typeMap,
  getNewCartData
}
