// 公司員工資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { itemId, objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 公司 ID */
  companyId: itemId,
  /** 目前是否在職 */
  employed: z.boolean().default(false),
})

export function getDBEmployees(db: Db) {
  return db.collection('employees')
}
