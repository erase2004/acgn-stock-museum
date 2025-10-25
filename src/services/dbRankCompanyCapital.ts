// 公司資本額排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import { integer, itemId } from './schema'

export const schema = z.object({
  /** 商業季度 */
  seasonId: itemId,
  /** 公司 ID */
  companyId: itemId,
  /** 資本額 */
  capital: integer,
  /** 總釋出股票 */
  totalRelease: integer,
  /** 參考總市值 */
  totalValue: integer,
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
