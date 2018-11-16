import AV from '../index'

async function getShop (venderId) {
  const shopQuery = new AV.Query('shop')
  shopQuery.equalTo('venderId', Number(venderId))
  const findRes = await shopQuery.find()
  let result = findRes[0].toJSON()
  const floors = await Promise.all(result.floors.map(async (floor) => {
    const objectIds = floor.commodities.map((item) => {
      const comObject = AV.Object.createWithoutData('commodity', item.objectId)
      return comObject
    })
    const commodities = await AV.Object.fetchAll(objectIds)
    floor.commodities = commodities.map(com => com.toJSON())
    return floor
  }))
  result.floors = floors
  return { result: { data: result } }
}

exports.getShop = getShop
