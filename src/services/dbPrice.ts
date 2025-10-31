// 交易價格資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { datetime, itemId, integer } from './schema'

export const schema = z.object({
  /** 公司 ID */
  companyId: itemId,
  /** 價格 */
  price: integer.min(1),
  /** 交易日期 */
  createdAt: datetime,
})

export function getDBPrice(db: Db) {
  return db.collection('price')
}
