// 公司資本額排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'

export const schema = z.object({
  /** 商業季度 */
  seasonId: z.string(),
  /** 公司 ID */
  companyId: z.string(),
  /** 資本額 */
  capital: z.number().int(),
  /** 總釋出股票 */
  totalRelease: z.number().int(),
  /** 參考總市值 */
  totalValue: z.number().int(),
})

export function getDBRankCompanyCapital(db: Db) {
  return db.collection('rankCompanyCapital')
}

export async function getRankCompanyCapitalBySeasonId(db: Db, seasonId: string) {
  const dbRankCompanyCapital = getDBRankCompanyCapital(db)
  return handlePromiseParser(
    z.promise(schema.array()).parse(dbRankCompanyCapital.find({ seasonId }).toArray()),
  )
}
