// 稅金資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { datetime, integer, objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 財富稅 (適於於第四季之前) */
  tax: integer.min(0).optional(),
  /** 需繳納的股票稅 (適用於第四季以後) */
  stockTax: integer.min(0).optional(),
  /** 需繳納的現金稅 (適用於第四季以後) */
  moneyTax: integer.min(0).optional(),
  /** 需繳納的殭屍稅金 */
  zombieTax: integer.min(0),
  /** 因逾期未繳產生的罰金 */
  fine: integer.default(0),
  /** 已繳納的稅金 */
  paid: integer.default(0),
  /** 繳稅期限 */
  expireDate: datetime,
})

export function getDBTaxes(db: Db) {
  return db.collection('taxes')
}
