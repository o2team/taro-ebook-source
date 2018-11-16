import AV from '../index'

export async function getCart (h5Id) {
  const Cart = AV.Object.extend('Cart')
  const CartQuery = new AV.Query('Cart')
  let cartData = {
    h5Id,
    cartNum: 0,
    totalPrice: 0,
    cartInfo: [],
    shopMap: [{}]
  }
  CartQuery.equalTo('h5Id', h5Id)
  const res = await CartQuery.find()
  if (res.length === 0) {
    const cartItem = new Cart()
    for(let key in cartData) {
      cartItem.set(key, cartData[key])
    }
    await cartItem.save()
  } else {
    cartData = res[0].toJSON()
  }
  return { result: { data: cartData } } 
}
