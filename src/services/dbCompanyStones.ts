// 公司挖礦機石頭放置資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { datetime, itemId, objectId } from './schema'

// 石頭種類列表
export const stoneTypeList = [
  'saint', // 聖晶石
  'birth', // 誕生石
  'rainbow', // 彩虹石
  'rainbowFragment', // 彩紅石碎片
  'quest', // 任務石
] as const

export type StoneType = (typeof stoneTypeList)[number]

export const stonePowerTable = {
  saint: 0.5,
  birth: 1,
  rainbow: 5,
  rainbowFragment: 2,
  quest: 0.5,
} as const satisfies Record<StoneType, number>

export const schema = z.object({
  _id: objectId,
  /** 公司 ID */
  companyId: itemId,
  /** 放置者 User ID */
  userId: itemId,
  /** 石頭種類 */
  stoneType: z.enum(stoneTypeList),
  /** 放置時間 */
  placedAt: datetime,
})

export function getDBCompanyStones(db: Db) {
  return db.collection('companyStones')
}
