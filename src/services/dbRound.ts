import { z } from 'astro/zod'
import type { Db } from 'mongodb'

export const schema = z.object({
  /** 起始日期 */
  beginDate: z.coerce.date(),
  /** 結束日期 */
  endDate: z.coerce.date(),
})

export function getDBRound(db: Db) {
  const dbRound = db.collection('round')

  return dbRound
}

export async function getCurrentRound(db: Db) {
  const dbRound = getDBRound(db)
  const { data } = await z
    .promise(schema)
    .safeParse(dbRound.findOne({}, { sort: { beginDate: -1 } }))
  return data
}
