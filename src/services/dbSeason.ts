import { z } from 'astro/zod'
import type { Db } from 'mongodb'

export const schema = z.object({
  /** 賽季的第幾季度 */
  ordinal: z.number().int(),
  /** 起始日期 */
  beginDate: z.coerce.date(),
  /** 結束日期 */
  endDate: z.coerce.date(),
  /** 當季有多少驗證通過的使用者 */
  userCount: z.number().int(),
  /** 當季起始時有多少未被查封的公司 */
  companiesCount: z.number().int(),
  /** 當季有多少推出的新產品 */
  productCount: z.number().int(),
})

export function getDBSeason(db: Db) {
  const dbSeason = db.collection('season')

  return dbSeason
}

export async function getCurrentSeason(db: Db) {
  const dbSeason = getDBSeason(db)
  const { data } = await z
    .promise(schema)
    .safeParse(dbSeason.findOne({}, { sort: { beginDate: -1 } }))
  return data
}

export async function getPreviousSeason(db: Db) {
  const dbSeason = getDBSeason(db)
  const { data } = await z
    .promise(schema)
    .safeParse(dbSeason.findOne({}, { sort: { beginDate: -1 }, skip: 1 }))
  return data
}
