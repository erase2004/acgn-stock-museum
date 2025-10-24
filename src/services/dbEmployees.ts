// 公司員工資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'

export const schema = z.object({
  _id: z.coerce.string(),
  /** 公司 ID */
  companyId: z.string(),
  /** 目前是否在職 */
  employed: z.boolean().default(false),
})

export function getDBEmployees(db: Db) {
  return db.collection('employees')
}
