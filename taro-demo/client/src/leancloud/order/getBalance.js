import AV from '../index'

async function getBalance (data) {
  const { h5Id } = data
  const CartQuery = new AV.Query('Cart')
  CartQuery.equalTo('h5Id', h5Id)
  const res = await CartQuery.find()
  const cartData = res[0].toJSON()
  const payInfo = cartData.cartInfo.filter((item) => {
    return item.isCheck
  })

  const balanceData = {
    isNeedBanlance: payInfo.length !== 0,
    payInfo,
    shopMap: cartData.shopMap,
    totalPrice: cartData.totalPrice
  }

  return { result: { data: balanceData } } 
}

exports.getBalance = getBalance
