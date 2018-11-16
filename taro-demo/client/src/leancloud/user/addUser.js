import AV from '../index'

export async function addUser (h5Id) {
  const Man = AV.Object.extend('Man')
  const man = new Man()
  man.set('h5Id', h5Id)
  const res = await man.save()
  return res
}

