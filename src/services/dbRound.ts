// 賽季資料集
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import type { Db } from 'mongodb'

export const schema = z.object({
  /** 起始日期 */
  beginDate: z.coerce.date(),
  /** 結束日期 */
  endDate: z.coerce.date(),
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
