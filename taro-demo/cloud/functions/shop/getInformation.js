async function getInformation (db) {
  const collection = db.collection('information')
  const res = await collection.get()
  return res.data
}

exports.getInformation = getInformation