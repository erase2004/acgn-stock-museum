// 違規案件資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser, typedObjectKeys } from '@/utils/helpers'
import { datetime, itemId, objectId, withCountSchema } from './schema'

const violatorTypeList = ['user', 'company', 'product'] as const

export const stateMap = {
  pending: {
    displayName: '待處理',
  },
  processing: {
    displayName: '處理中',
  },
  rejected: {
    displayName: '已駁回',
  },
  closed: {
    displayName: '已結案',
  },
}

export const categoryMap = {
  company: {
    displayName: '公司違規',
  },
  foundation: {
    displayName: '新創違規',
  },
  product: {
    displayName: '產品違規',
  },
  advertising: {
    displayName: '廣告違規',
  },
  multipleAccounts: {
    displayName: '分身違規',
  },
  miscellaneous: {
    displayName: '其他違規',
  },
}

export const violatorSchema = z.object({
  /** 違規者的型態 */
  violatorType: z.enum(violatorTypeList),
  /** 違規者的 ID */
  violatorId: itemId,
})

export const schema = z.object({
  _id: objectId,
  /** 違規案件目前處理狀態 */
  state: z.enum(typedObjectKeys(stateMap)),
  /** 違規案件類型 */
  category: z.enum(typedObjectKeys(categoryMap)),
  /** 案件描述 */
  description: z.string().min(10).max(3000),
  /** 違規名單 */
  violators: violatorSchema.array(),
  /** 未讀的使用者標記 */
  unreadUsers: itemId.array(),
  /** 相關案件 */
  relatedCases: itemId.array(),
  /** 建立日期 */
  createdAt: datetime,
  /** 最後更新日期 */
  updatedAt: datetime,
})

export function getDBViolationCase(db: Db) {
  return db.collection('violationCases')
}

export const listItemSchema = schema
  .pick({
    _id: true,
    state: true,
    category: true,
    createdAt: true,
    updatedAt: true,
    violators: true,
  })
  .extend({
    descriptionDigest: z.string(),
    descriptionOmittedLength: z.number(),
  })

export const casesWithCountSchema = withCountSchema(listItemSchema)

const DESCRIPTION_DIGEST_LENGTH_LIMIT = 100

export function getViolationCases(db: Db, roundBegin: Date) {
  const dbViolationCases = getDBViolationCase(db)

  return handlePromiseParser(
    z.promise(casesWithCountSchema).parse(
      dbViolationCases
        .aggregate([
          {
            $match: {
              updatedAt: {
                $gte: roundBegin,
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $set: {
              descriptionDigest: {
                $substrCP: ['$description', 0, DESCRIPTION_DIGEST_LENGTH_LIMIT],
              },
              descriptionOmittedLength: {
                $subtract: [
                  {
                    $strLenCP: '$description',
                  },
                  {
                    $strLenCP: {
                      $substrCP: ['$description', 0, DESCRIPTION_DIGEST_LENGTH_LIMIT],
                    },
                  },
                ],
              },
            },
          },
          {
            $facet: {
              total: [{ $count: 'total' }],
              data: [],
            },
          },
        ])
        .toArray(),
    ),
  )
}

export async function getViolationCaseById(db: Db, caseId: string, roundBegin: Date) {
  const dbViolationCases = getDBViolationCase(db)

  return handlePromiseParser(
    z.promise(schema).parse(
      dbViolationCases.findOne({
        // @ts-expect-error: caseId is valid ObjectId
        _id: caseId,
        updatedAt: {
          $gte: roundBegin,
        },
      }),
    ),
  )
}

export const simpleSchema = schema.pick({
  _id: true,
  category: true,
  state: true,
  createdAt: true,
})

export async function getViolationCasesByUserId(db: Db, userId: string, roundBegin: Date) {
  const dbViolationCases = getDBViolationCase(db)

  return handlePromiseParser(
    z.promise(simpleSchema.array()).parse(
      dbViolationCases
        .find(
          {
            'violators.violatorType': 'user',
            'violators.violatorId': userId,
            updatedAt: {
              $gte: roundBegin,
            },
          },
          { sort: { createdAt: -1 } },
        )
        .toArray(),
    ),
  )
}

export async function getViolationCasesByCompanyId(db: Db, companyId: string, roundBegin: Date) {
  const dbViolationCases = getDBViolationCase(db)

  return handlePromiseParser(
    z.promise(simpleSchema.array()).parse(
      dbViolationCases
        .find(
          {
            'violators.violatorType': 'company',
            'violators.violatorId': companyId,
            updatedAt: {
              $gte: roundBegin,
            },
          },
          { sort: { createdAt: -1 } },
        )
        .toArray(),
    ),
  )
}

export async function getAllBasicViolationCase(db: Db, roundBegin: Date) {
  const _schema = schema.pick({ _id: true })
  const dbViolationCases = getDBViolationCase(db)

  return handlePromiseParser(
    z.promise(_schema.array()).parse(
      dbViolationCases
        .find({
          updatedAt: {
            $gte: roundBegin,
          },
        })
        .toArray(),
    ),
  )
}
