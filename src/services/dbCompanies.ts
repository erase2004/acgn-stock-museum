// 公司資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 董事長的稱謂 */
  chairmanTitle: z.string().max(20).default('董事長'),
  /** 是否被金管會查封關停 */
  isSeal: z.boolean().default(false),
})

export function getDBCompanies(db: Db) {
  return db.collection('companies')
}
