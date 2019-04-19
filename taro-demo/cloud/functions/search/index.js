const app = require('wx-server-sdk')

const { getList } = require('./getList.js')

app.init({
  envName: 'taro-ebook-23bbcb',
  mpAppId: 'wx9504f077bdc24ea2',
})

exports.main = async (event, context) => {
  const db = app.database()
  const { func, data } = event
  let res
  if (func === 'getList') {
    res = await getList(db, data)
  } 
  return {
    context,
    data: res
  }
}