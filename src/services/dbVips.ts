// 公司 VIP 會員資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { integer, itemId } from './schema'

export const schema = z.object({
  /** 公司 ID */
  companyId: itemId,
  /** 目前等級 */
  level: integer.min(0).default(0),
})

export function getDBVips(db: Db) {
  return db.collection('vips')
}
