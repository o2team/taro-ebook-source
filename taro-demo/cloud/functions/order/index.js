const app = require('tcb-admin-node')

const { getBalance } = require('./getBalance.js')
const { addOrder } = require('./addOrder.js')
const { getOrder } = require('./getOrder.js')
const { cancelOrder } = require('./cancelOrder.js')
const { getOrderDetail } = require('./getOrderDetail.js')

app.init({
  envName: 'taro-ebook-23bbcb',
  mpAppId: 'wx9504f077bdc24ea2',
  // secretId: 'AKIDuA6QxlhN9619IeT2y45S8tmCvRtnubjs',
  // secretKey: 'qXW08RurtFSb6YYZs73DvEQ1qmEFSDIJ',
  // sessionToken: '4431b3f2da2e54cdce7c85a8714b8abb63ca397340001'
})

async function main (event, context) {
  const db = app.database()
  const { func, data } = event
  let res
  if (func === 'getBalance') {
    res = await getBalance(app, data)
  } else if (func === 'addOrder') {
    res = await addOrder(db, data)
  } else if (func === 'getOrder') {
    res = await getOrder(db, data)
  } else if (func === 'getOrderDetail') {
    res = await getOrderDetail(db, data)
  } else if (func === 'cancelOrder') {
    res = await cancelOrder(db, data)
  }

  return {
    data: res
  }
}

exports.main = main

// // 测试的函数
// async function test (params) {
//   const res = await main({
//     func: 'getOrder',
//     data: {
//       _id: 'oFQSH5MekinNSc_yqH9dNlmKh6vI'
//     }
//   })

//   console.log(res)
// }

// test()
