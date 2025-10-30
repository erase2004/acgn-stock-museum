// 公司員工資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { datetime, itemId, objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 公司 ID */
  companyId: itemId,
  /** 使用者 User ID */
  userId: itemId,
  /** 目前是否在職 */
  employed: z.boolean().default(false),
  /** 登記加入時間 */
  registerAt: datetime,
  /** 員工留言 */
  message: z.string().max(100).optional(),
})

export function getDBEmployees(db: Db) {
  return db.collection('employees')
}
