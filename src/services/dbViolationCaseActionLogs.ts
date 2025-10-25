// 違規案件處理動作紀錄資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser, typedObjectKeys } from '@/utils/helpers'
import { stateMap, violatorSchema } from './dbViolationCases'
import { datetime, itemId, objectId } from './schema'

const reasonSchema = z.object({
  reason: z.string().min(1).max(2000),
})

export const actionMap = {
  setState: {
    displayName: '設定案件狀態',
    dataSchema: z
      .object({
        state: z.enum(typedObjectKeys(stateMap)),
      })
      .merge(reasonSchema),
  },
  fscComment: {
    displayName: '金管會加註',
    dataSchema: reasonSchema,
  },
  informerComment: {
    displayName: '舉報人說明',
    dataSchema: reasonSchema,
  },
  violatorComment: {
    displayName: '違規人說明',
    dataSchema: reasonSchema,
  },
  addRelatedCase: {
    displayName: '增加相關案件',
    dataSchema: z
      .object({
        relatedCaseId: itemId,
      })
      .merge(reasonSchema),
  },
  removeRelatedCase: {
    displayName: '移除相關案件',
    dataSchema: z
      .object({
        relatedCaseId: itemId,
      })
      .merge(reasonSchema),
  },
  mergeViolatorsFromRelatedCase: {
    displayName: '從相關案件合併違規名單',
    dataSchema: z
      .object({
        relatedCaseId: itemId,
        newViolators: violatorSchema.array(),
      })
      .merge(reasonSchema),
  },
  addViolator: {
    displayName: '增加違規名單',
    dataSchema: z
      .object({
        newViolators: violatorSchema.array(),
      })
      .merge(reasonSchema),
  },
  removeViolator: {
    displayName: '移除違規名單',
    dataSchema: z
      .object({
        violator: violatorSchema,
      })
      .merge(reasonSchema),
  },
}

export const schema = z
  .object({
    _id: objectId,
    /** 案件 ID */
    violationCaseId: itemId,
    /** 執行的動作 */
    action: z.enum(typedObjectKeys(actionMap)),
    /** 執行人 User ID */
    executor: itemId,
    /** 額外資料 */
    data: z.any(),
    /** 執行時間 */
    executedAt: datetime,
  })
  .refine(
    (val) => {
      const action = val.action
      const { dataSchema } = actionMap[action] || {}

      if (!dataSchema) return false

      const { success } = dataSchema.safeParse(val.data)
      return success
    },
    {
      message: 'data is not valid',
    },
  )

export function getDBViolationCaseActionLog(db: Db) {
  return db.collection('violationCaseActionLogs')
}

export async function getRelatedActionLog(db: Db, violationCaseId: string) {
  const dbViolationCaseActionLogs = getDBViolationCaseActionLog(db)

  return handlePromiseParser(
    z.promise(schema.array()).parse(
      dbViolationCaseActionLogs
        .find(
          {
            violationCaseId,
          },
          { sort: { executedAt: 1 } },
        )
        .toArray(),
    ),
  )
}
