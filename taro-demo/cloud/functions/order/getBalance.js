async function getBalance (app, data) {
  const { _id } = data
  const res = await app.callFunction({
    name: 'cart',
    data: {
      func: 'getCart',
      data: {
        _id
      }
    }
  })
  const cartData = res.result.data
  const payInfo = cartData.cartInfo.filter((item) => {
    return item.isCheck
  })

  const balanceData = {
    isNeedBanlance: payInfo.length !== 0,
    payInfo,
    shopMap: cartData.shopMap,
    totalPrice: cartData.totalPrice
  }

  return balanceData
}

exports.getBalance = getBalance
