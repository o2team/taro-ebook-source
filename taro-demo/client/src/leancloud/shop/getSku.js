import AV from '../index'

export async function getSku (skuId) {
  const CommodityQuery = new AV.Query('commodity')
  CommodityQuery.equalTo('skuId', Number(skuId))
  const findRes = await CommodityQuery.find()
  const result = findRes[0].toJSON()
  return { result: { data: [result] } }
}

