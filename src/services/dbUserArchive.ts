// 使用者保管庫
import type { Db } from 'mongodb'
import { z } from 'astro/zod'

export type VALIDATE_TYPE = z.infer<typeof schema>['validateType']

export const schema = z.object({
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

export function getArchivedUser(db: Db, userId: string) {
  const dbUserArchive = getDBUserArchive(db)

  return (
    z
      .promise(schema)
      // @ts-expect-error: key is valid ObjectId
      .parse(dbUserArchive.findOne({ _id: userId }))
  )
}
