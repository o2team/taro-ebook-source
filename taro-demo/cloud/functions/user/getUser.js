async function getUser (db, _openid) {
  const _ = db.command
  const collection = db.collection('user')
  const user = await collection.where({
    _openid: _.eq(_openid)
  })

  return user
}

exports.getUser = getUser
