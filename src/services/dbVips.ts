// 公司 VIP 會員資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'

export const schema = z.object({
  /** 公司 ID */
  companyId: z.string(),
  /** 目前等級 */
  level: z.number().int().min(0).default(0),
})

export function getDBVips(db: Db) {
  return db.collection('vips')
}
