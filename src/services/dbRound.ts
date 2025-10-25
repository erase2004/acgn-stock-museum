// 賽季資料集
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import { datetime } from './schema'

export const schema = z.object({
  /** 起始日期 */
  beginDate: datetime,
  /** 結束日期 */
  endDate: datetime,
})

export function getDBRound(db: Db) {
  return db.collection('round')
}

export async function getCurrentRound(db: Db) {
  const dbRound = getDBRound(db)

  return handlePromiseParser(
    z.promise(schema).parse(dbRound.findOne({}, { sort: { beginDate: -1 } })),
  )
}
