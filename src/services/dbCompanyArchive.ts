// 公司保管庫資料集
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
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

export async function getArchivedCompany(db: Db, companyId: string) {
  const dbCompanyArchive = getDBCompanyArchive(db)

  return handlePromiseParser(
    z
      .promise(schema)
      // @ts-expect-error: key is valid ObjectId
      .parse(dbCompanyArchive.findOne({ _id: companyId })),
  )
}

export async function getAllArchivedCompanies(db: Db) {
  const dbCompanyArchive = getDBCompanyArchive(db)

  return handlePromiseParser(
    z.promise(schema.pick({ _id: true, companyName: true }).array()).parse(
      dbCompanyArchive
        .find(
          {
            status: 'market',
          },
          {
            // @ts-expect-error: _id is valid field
            _id: true,
            companyName: true,
          },
        )
        .toArray(),
    ),
  )
}
