// 季度資料集
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import type { Db } from 'mongodb'

export const schema = z.object({
  _id: z.coerce.string(),
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
  return db.collection('season')
}

export async function getLatestSeason(db: Db) {
  const dbSeason = getDBSeason(db)
  return handlePromiseParser(
    z.promise(schema).parse(dbSeason.findOne({}, { sort: { beginDate: -1 } })),
  )
}

export async function getPreviousSeason(db: Db, currentSeason: z.infer<typeof schema>) {
  const dbSeason = getDBSeason(db)
  return handlePromiseParser(
    z.promise(schema).parse(
      dbSeason.findOne(
        {
          beginDate: {
            $lt: currentSeason.beginDate,
          },
        },
        {
          sort: {
            beginDate: -1,
          },
        },
      ),
    ),
  )
}

export async function getNextSeason(db: Db, currentSeason: z.infer<typeof schema>) {
  const dbSeason = getDBSeason(db)
  return handlePromiseParser(
    z.promise(schema).parse(
      dbSeason.findOne(
        {
          beginDate: {
            $gte: currentSeason.endDate,
          },
        },
        {
          sort: {
            beginDate: 1,
          },
        },
      ),
    ),
  )
}

export async function getSeasonById(db: Db, seasonId: string) {
  const dbSeason = getDBSeason(db)
  // @ts-expect-error: seasonId is valid ObjectId
  return handlePromiseParser(z.promise(schema).parse(dbSeason.findOne({ _id: seasonId })))
}
