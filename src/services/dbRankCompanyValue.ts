// 公司市值排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import { integer, itemId } from './schema'

export const schema = z.object({
  /** 商業季度 */
  seasonId: itemId,
  /** 公司 ID */
  companyId: itemId,
  /** 成交股價 */
  lastPrice: integer,
  /** 總釋出股票 */
  totalRelease: integer,
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
