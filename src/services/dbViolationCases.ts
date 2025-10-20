// 違規案件資料集
import type { Db, Document } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser, typedObjectKeys } from '@/utils/helpers'

const violatorTypeList = ['user', 'company', 'product'] as const

export const stateMap = {
  pending: {
    displayName: '待處理',
    nextStates: ['processing'],
  },
  processing: {
    displayName: '處理中',
    nextStates: ['closed', 'rejected'],
  },
  rejected: {
    displayName: '已駁回',
    nextStates: ['processing'],
  },
  closed: {
    displayName: '已結案',
    nextStates: ['processing'],
  },
}

export const categoryMap = {
  company: {
    displayName: '公司違規',
    allowedInitialViolatorTypes: ['company'],
  },
  foundation: {
    displayName: '新創違規',
    allowedInitialViolatorTypes: ['company'],
  },
  product: {
    displayName: '產品違規',
    allowedInitialViolatorTypes: ['product'],
  },
  advertising: {
    displayName: '廣告違規',
    allowedInitialViolatorTypes: ['user'],
  },
  multipleAccounts: {
    displayName: '分身違規',
    allowedInitialViolatorTypes: ['user'],
  },
  miscellaneous: {
    displayName: '其他違規',
    allowedInitialViolatorTypes: violatorTypeList,
  },
}

export const violatorSchema = z.object({
  /** 違規者的型態 */
  violatorType: z.enum(violatorTypeList),
  /** 違規者的 ID */
  violatorId: z.string(),
})

export const schema = z.object({
  _id: z.coerce.string(),
  /** 違規案件目前處理狀態 */
  state: z.enum(typedObjectKeys(stateMap)),
  /** 違規案件類型 */
  category: z.enum(typedObjectKeys(categoryMap)),
  /** 案件描述 */
  description: z.string().min(10).max(3000),
  /** 違規名單 */
  violators: violatorSchema.array(),
  /** 未讀的使用者標記 */
  unreadUsers: z.string().array(),
  /** 相關案件 */
  relatedCases: z.string().array(),
  /** 建立日期 */
  createdAt: z.coerce.date(),
  /** 最後更新日期 */
  updatedAt: z.coerce.date(),
})

export const querySchema = schema
  .pick({
    category: true,
    state: true,
  })
  .extend({
    violatorUserId: z.string(),
  })
  .partial()

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

export const casesWithCountSchema = z
  .object({
    total: z
      .object({
        total: z.number().int(),
      })
      .array()
      .max(1),
    data: listItemSchema.array(),
  })
  .array()

type FilterOption = {
  category?: z.infer<typeof schema>['category']
  state?: z.infer<typeof schema>['state']
  violatorUserId?: string
  onlyUnread?: boolean
}

const DESCRIPTION_DIGEST_LENGTH_LIMIT = 100

export function getViolationCases(
  db: Db,
  filterOption: FilterOption,
  size: number,
  page: number = 1,
) {
  const dbViolationCases = getDBViolationCase(db)

  // TODO: add unread handle
  const { category, state, violatorUserId } = filterOption
  const filter: Document = {}

  if (category) {
    Object.assign(filter, { category })
  }

  if (state) {
    Object.assign(filter, { state })
  }

  if (violatorUserId) {
    Object.assign(filter, {
      'violators.violatorType': 'user',
      'violators.violatorId': violatorUserId,
    })
  }

  return handlePromiseParser(
    z.promise(casesWithCountSchema).parse(
      dbViolationCases
        .aggregate([
          {
            $match: filter,
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
              data: [{ $skip: (page - 1) * size }, { $limit: size }],
            },
          },
        ])
        .toArray(),
    ),
  )
}
