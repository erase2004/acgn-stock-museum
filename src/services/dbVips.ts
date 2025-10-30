// 公司 VIP 會員資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { integer, itemId } from './schema'
import { handlePromiseParser, roundToDecimalPlaces } from '@/utils/helpers'
import { map } from 'lodash-es'

export const levelConfig = [
  {
    level: 0,
    ratio: 0,
  },
  {
    level: 1,
    ratio: 0.2,
  },
  {
    level: 2,
    ratio: 0.4,
  },
  {
    level: 3,
    ratio: 0.6,
  },
  {
    level: 4,
    ratio: 0.8,
  },
  {
    level: 5,
    ratio: 1,
  },
] as const

// VIP 分數要保持的小數位數
const VIP_SCORE_DECIMAL_PLACES = 3

// 取得各等級 VIP 的門檻值
export function getVipThresholds(capital: number) {
  const baseThreshold = Math.pow(1487 / capital, 0.6) * capital

  return map(levelConfig, 'ratio')
    .map((r, i) => {
      const score = roundToDecimalPlaces(r * baseThreshold, VIP_SCORE_DECIMAL_PLACES)

      return {
        level: i,
        score,
      }
    })
    .slice(1)
    .reverse()
}

export const schema = z.object({
  /** 公司 ID */
  companyId: itemId,
  /** 玩家 ID */
  userId: itemId,
  /** 目前等級 */
  level: integer
    .min(0)
    .max(levelConfig.length - 1)
    .default(0),
  /** 目前分數 */
  score: z.number().min(0).default(0),
})

export function getDBVips(db: Db) {
  return db.collection('vips')
}

export async function getCompnayVips(db: Db, companyId: string) {
  const dbVips = getDBVips(db)

  return handlePromiseParser(
    z
      .promise(schema.array())
      .parse(dbVips.find({ companyId }, { sort: { score: -1, createdAt: 1 } }).toArray()),
  )
}
