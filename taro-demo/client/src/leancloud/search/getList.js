import AV from '../index'

async function getList (data) {
  const CommodityQuery = new AV.Query('commodity')

  let allGoods = await CommodityQuery.find()
  allGoods = allGoods.map(item => {
    return item.toJSON()
  })
  let res = {}
  let searchGoods = allGoods.filter(item => {
    return item.skuName.indexOf(data.keyWords) > -1 
  })

  res.wares = searchGoods
  res.count = searchGoods.length
  res.page = data.page
  return { result: { data: res } }
}

exports.getList = getList
