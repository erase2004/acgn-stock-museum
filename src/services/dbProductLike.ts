// 公司產品正面評價資料集（適用於第一季）
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { itemId } from './schema'

export const schema = z.object({
  /** 使用者 ID */
  userId: itemId,
  /** 產品公司 ID */
  companyId: itemId,
  /** 產品 ID */
  productId: itemId,
})

export function getDBProductLike(db: Db) {
  return db.collection('productLike')
}
