// 使用者財富排行榜
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import { integer, itemId } from './schema'

export const schema = z.object({
  /** 商業季度 */
  seasonId: itemId,
  /** 使用者 ID */
  userId: itemId,
  /** 擁有現金 */
  money: integer,
  /** 持股總價值 */
  stocksValue: integer,
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
