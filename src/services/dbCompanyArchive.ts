// 公司保管庫資料集
import { z } from 'astro/zod'
import type { Db } from 'mongodb'

export const schema = z.object({
  /** 公司名稱 */
  companyName: z.string(),
  /** 保管狀態 */
  status: z.enum(['archived', 'foundation', 'market']),
})

export function getDBCompanyArchive(db: Db) {
  return db.collection('companyArchive')
}

export function getArchivedCompany(db: Db, companyId: string) {
  const dbCompanyArchive = getDBCompanyArchive(db)

  return (
    z
      .promise(schema)
      // @ts-expect-error: key is valid ObjectId
      .parse(dbCompanyArchive.findOne({ _id: companyId }))
  )
}
