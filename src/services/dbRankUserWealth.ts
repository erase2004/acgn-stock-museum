// 使用者財富排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'

export const schema = z.object({
  /** 商業季度 */
  seasonId: z.string(),
  /** 使用者 ID */
  userId: z.string(),
  /** 擁有現金 */
  money: z.number().int(),
  /** 持股總價值 */
  stocksValue: z.number().int(),
})

export function getDBRankUserWealth(db: Db) {
  return db.collection('rankUserWealth')
}

export async function getRankUserWealthBySeasonId(db: Db, seasonId: string) {
  const dbRankUserWealth = getDBRankUserWealth(db)
  return handlePromiseParser(
    z.promise(schema.array()).parse(dbRankUserWealth.find({ seasonId }).toArray()),
  )
}
