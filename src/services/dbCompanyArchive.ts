// 公司保管庫資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 公司名稱 */
  companyName: z.string(),
  /** 保管狀態 */
  status: z.enum(['archived', 'foundation', 'market']),
})

export function getDBCompanyArchive(db: Db) {
  return db.collection('companyArchive')
}
