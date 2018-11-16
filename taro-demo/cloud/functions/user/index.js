const app = require('tcb-admin-node')

const { addUser } = require('./addUser.js')
const { getUser } = require('./getUser.js')

app.init({
  envName: 'taro-ebook-23bbcb',
  mpAppId: 'wx9504f077bdc24ea2'
})

exports.main = async (event, context) => {
  const db = app.database()
  const { func, data } = event
  let res
  if (func === 'addUser') {
    res = await addUser(db, data)
  } else if (func === 'getUser') {
    res = await getUser(db, data)
  }

  return {
    data: res
  }
}