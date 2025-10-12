import type { Db } from 'mongodb'

export function getDBSeason(db: Db) {
  const dbSeason = db.collection('season')

  return dbSeason
}

export async function getCurrentSeason(db: Db) {
  const dbSeason = getDBSeason(db)
  return await dbSeason.findOne({}, { sort: { beginDate: -1 } })
}

export async function getPreviousSeason(db: Db) {
  const dbSeason = getDBSeason(db)
  return await dbSeason.findOne({}, { sort: { beginDate: -1 }, skip: 1 })
}
