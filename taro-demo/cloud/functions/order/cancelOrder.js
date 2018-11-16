async function cancelOrder ( db, data) {
  const { orderId, cancelReasonText } = data
  const orderColl = db.collection('order')
  const _ = db.command

  await orderColl.doc(orderId).update({
    orderState: -1,
    cancelReasonText
  })

  return {
    code: 0,
    msg: '成功取消订单'
  }
}

exports.cancelOrder = cancelOrder
