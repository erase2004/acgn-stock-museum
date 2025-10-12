import type { Db } from 'mongodb'

export function getDBRound(db: Db) {
  const dbRound = db.collection('round')

  return dbRound
}

export async function getCurrentRound(db: Db) {
  const dbRound = getDBRound(db)
  return await dbRound.findOne({}, { sort: { beginDate: -1 } })
}
