// 使用者保管庫
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'
import { objectId } from './schema'
import { ValidateMethod } from './dbUsers'

export const schema = z.object({
  _id: objectId,
  /** 保管狀態 */
  status: z.enum(['archived', 'registered']),
  /** 使用者顯示名稱(如驗證來源為Google，則保存Email) */
  name: z.string(),
  /** 帳號驗證來源 */
  validateType: z.enum(ValidateMethod),
})

export function getDBUserArchive(db: Db) {
  return db.collection('userArchive')
}

export async function getAllArchivedUsers(db: Db) {
  const dbUserArchive = getDBUserArchive(db)

  return handlePromiseParser(
    z.promise(schema.pick({ _id: true, name: true }).array()).parse(
      dbUserArchive
        .find({})
        .project({
          _id: 1,
          name: 1,
        })
        .toArray(),
    ),
  )
}
