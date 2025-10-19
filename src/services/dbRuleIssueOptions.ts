// 議題選項資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'

export const schema = z.object({
  _id: z.coerce.string(),
  /** 議題選項標題 */
  title: z.string().min(1).max(100),
  /** 議題選項順序 */
  order: z.number(),
  /** 支持此選項的使用者 User ID */
  votes: z.string().array(),
})

export function getDBRuleIssueOptions(db: Db) {
  return db.collection('ruleIssueOptions')
}

export async function getRelatedIssueOptions(db: Db, optionIds: string[]) {
  const dbRuleIssueOptions = getDBRuleIssueOptions(db)

  return handlePromiseParser(
    z.promise(schema.array()).parse(
      dbRuleIssueOptions
        .find(
          {
            _id: {
              // @ts-expect-error: optionIds are valid ObjectId
              $in: optionIds,
            },
          },
          {
            sort: {
              order: 1,
            },
          },
        )
        .toArray(),
    ),
  )
}
