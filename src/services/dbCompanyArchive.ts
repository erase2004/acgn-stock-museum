// 公司保管庫資料集
import type { Db } from 'mongodb'
import { handlePromiseParser } from '@/utils/helpers'
import { z } from 'astro/zod'
import { objectId } from './schema'

export const schema = z
  .object({
    /** 公司名稱 */
    name: z.string(),
    /** 公司名稱 (第六季之後) */
    companyName: z.string(),
  })
  .partial()
  .merge(
    z.object({
      _id: objectId,
      /** 保管狀態 */
      status: z.enum(['archived', 'foundation', 'market']),
    }),
  )
  .refine((value) => 'name' in value || 'companyName' in value, {
    message: 'name or companyName should be set',
  })
  .transform((value) => {
    if ('name' in value) {
      return {
        ...value,
        companyName: value['name'],
      }
    }

    return value
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
    z.promise(schema.array()).parse(
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
