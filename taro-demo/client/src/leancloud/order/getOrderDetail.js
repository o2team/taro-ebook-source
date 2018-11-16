import AV from '../index'

async function getOrderDetail (data) {
  const { h5Id, orderId } = data
  const OrderQuery = new AV.Query('Order')

  OrderQuery.equalTo('ownerId', h5Id)
  OrderQuery.equalTo('orderId', orderId)
  const res = await OrderQuery.find()

  const orderData = res[0].toJSON()
 
  return { result: { data: orderData } } 
}

exports.getOrderDetail = getOrderDetail
