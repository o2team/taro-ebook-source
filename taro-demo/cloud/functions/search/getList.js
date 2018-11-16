async function getList (db, data) {
  const commColl = db.collection('commodity')
  const _ = db.command

  const allGoods = await commColl.get()
  let res = {}
  let searchGoods = allGoods.data.filter(item => {
    return item.skuName.indexOf(data.keyWords) > -1 
  })
  res.wares = searchGoods
  res.count = searchGoods.length
  res.page = data.page
  return res
}

exports.getList = getList
