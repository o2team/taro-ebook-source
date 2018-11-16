async function getOrderDetail (db, data) {
  const { _id, orderId } = data
  const orderColl = db.collection('order')
  const _ = db.command

  const res = await orderColl.where({
    ownerId: _.eq(_id),
    orderId: _.eq(orderId)
  }).get()

  const orderData = res.data[0]

  return orderData
}

exports.getOrderDetail = getOrderDetail
