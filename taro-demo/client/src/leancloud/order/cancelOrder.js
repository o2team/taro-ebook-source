import AV from '../index'

async function cancelOrder (data) {
  const { orderId, cancelReasonText } = data
  const OrderQuery = new AV.Query('Order')

  OrderQuery.equalTo('orderId', orderId)
  const res = await OrderQuery.find()
  const orderData = res[0].toJSON()
  const orderObjectId = orderData.objectId

  const newOrder = AV.Object.createWithoutData('Order', orderObjectId)
  newOrder.set('orderState', -1)
  newOrder.set('cancelReasonText', cancelReasonText)
  await newOrder.save()

  const returnData = {
    code: 0,
    msg: '成功取消订单'
  }

  return { result: { data: returnData } }
}

exports.cancelOrder = cancelOrder
