// 公司股價排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import { itemId } from './schema'

export const schema = z.object({
  /** 商業季度 */
  seasonId: itemId,
  /** 公司 ID */
  companyId: itemId,
  /** 成交量 */
  totalDealAmount: z.number(),
  /** 成交額 */
  totalDealMoney: z.number(),
  /** 產品營利 */
  productProfit: z.number(),
})

export function getDBRankCompanyPrice(db: Db) {
  return db.collection('rankCompanyPrice')
}

export async function getRankCompanyPriceBySeasonId(db: Db, seasonId: string) {
  const dbRankCompanyPrice = getDBRankCompanyPrice(db)
  return handlePromiseParser(
    z.promise(schema.array()).parse(dbRankCompanyPrice.find({ seasonId }).toArray()),
  )
}
