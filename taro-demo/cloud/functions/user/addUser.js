async function addUser (db, userInfo) {
  const collection = db.collection('user')
  await collection.doc(userInfo._id).set(userInfo)
  return userInfo
}

exports.addUser = addUser
