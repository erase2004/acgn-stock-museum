// 議題資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'
import { itemId } from './schema'

export const schema = z.object({
  /** 議題標題 */
  title: z.string().min(1).max(100),
  /** 議題允許多選 */
  multiple: z.boolean(),
  /** 議題順序 */
  order: z.number(),
  /** 議題列表 */
  options: itemId.array(),
})

export function getDBRuleIssues(db: Db) {
  return db.collection('ruleIssues')
}

export async function getRelatedIssues(db: Db, issueIds: string[]) {
  const dbRuleIssues = getDBRuleIssues(db)

  return handlePromiseParser(
    z.promise(schema.array()).parse(
      dbRuleIssues
        .find(
          {
            _id: {
              // @ts-expect-error: issueIds are valid ObjectId
              $in: issueIds,
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
