import AV from '../index'

async function getOrder (data) {
  const { h5Id } = data
  const OrderQuery = new AV.Query('Order')

  OrderQuery.equalTo('ownerId', h5Id)
  OrderQuery.descending('createdAt')
  const res = await OrderQuery.find()
  const orderData = res.map(item => {
    return item.toJSON()
  })

  return { result: { data: orderData } }
}

exports.getOrder = getOrder
