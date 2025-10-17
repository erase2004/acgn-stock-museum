// 使用者保管庫
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'

export type VALIDATE_TYPE = z.infer<typeof schema>['validateType']

export const schema = z.object({
  _id: z.coerce.string(),
  /** 保管狀態 */
  status: z.enum(['archived', 'registered']),
  /** 使用者顯示名稱(如驗證來源為Google，則保存Email) */
  name: z.string(),
  /** 帳號驗證來源 */
  validateType: z.enum(['Google', 'PTT', 'Bahamut']),
})

export function getDBUserArchive(db: Db) {
  return db.collection('userArchive')
}

export async function getArchivedUser(db: Db, userId: string) {
  const dbUserArchive = getDBUserArchive(db)

  return handlePromiseParser(
    z
      .promise(schema)
      // @ts-expect-error: key is valid ObjectId
      .parse(dbUserArchive.findOne({ _id: userId })),
  )
}

export async function getAllArchivedUsers(db: Db) {
  const dbUserArchive = getDBUserArchive(db)

  return handlePromiseParser(
    z.promise(schema.pick({ _id: true, name: true }).array()).parse(
      dbUserArchive
        .find(
          {},
          {
            // @ts-expect-error: _id is valid field
            _id: true,
            name: true,
          },
        )
        .toArray(),
    ),
  )
}
