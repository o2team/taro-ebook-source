import AV from '../index'

export async function getInformation () {
  const InfomationQuery = new AV.Query('Infomation')
  const findRes = await InfomationQuery.find()
  const result = findRes.map(item => {
    return item.toJSON()
  })
  return { result: { data: result } }
}
