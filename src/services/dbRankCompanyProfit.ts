// 公司營利排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'

export const schema = z.object({
  /** 商業季度 */
  seasonId: z.string(),
  /** 公司 ID */
  companyId: z.string(),
  /** 總釋出股票 */
  totalRelease: z.number().int(),
  /** 平均股價 */
  avgPrice: z.number(),
  /** 營利額 */
  profit: z.number(),
  /** 益本比 */
  priceToEarn: z.number(),
})

export function getDBRankCompanyProfit(db: Db) {
  return db.collection('rankCompanyProfit')
}

export async function getRankCompanyProfitBySeasonId(db: Db, seasonId: string) {
  const dbRankCompanyProfit = getDBRankCompanyProfit(db)
  return handlePromiseParser(
    z.promise(schema.array()).parse(dbRankCompanyProfit.find({ seasonId }).toArray()),
  )
}
