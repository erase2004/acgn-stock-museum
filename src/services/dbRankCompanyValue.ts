// 公司市值排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'

export const schema = z.object({
  /** 商業季度 */
  seasonId: z.string(),
  /** 公司 ID */
  companyId: z.string(),
  /** 成交股價 */
  lastPrice: z.number().int(),
  /** 總釋出股票 */
  totalRelease: z.number().int(),
})

export function getDBRankCompanyValue(db: Db) {
  return db.collection('rankCompanyValue')
}

export async function getRankCompanyValueBySeasonId(db: Db, seasonId: string) {
  const dbRankCompanyValue = getDBRankCompanyValue(db)
  return handlePromiseParser(
    z.promise(schema.array()).parse(dbRankCompanyValue.find({ seasonId }).toArray()),
  )
}
