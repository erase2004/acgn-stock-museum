// 最萌亂鬥大賽資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'
import { datetime, itemId, objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 起始日期 */
  beginDate: datetime,
  /** 結束日期 */
  endDate: datetime,
  /** 報名截止日期 */
  joinEndDate: datetime,
  /** 所有參賽者 companyId 依隨機順序排列，在報名截止後生成，dbArenaFighters 的 attackSequence 將對應此陣列的index。 */
  shuffledFighterCompanyIdList: itemId.array(),
})

export function getDBArena(db: Db) {
  return db.collection('arena')
}

export async function getArenaById(db: Db, arenaId: string) {
  const dbArena = getDBArena(db)
  // @ts-expect-error: arenaId is valid ObjectId
  return handlePromiseParser(z.promise(schema).parse(dbArena.findOne({ _id: arenaId })))
}

export async function getLatestArena(db: Db) {
  const dbArena = getDBArena(db)

  return handlePromiseParser(
    z.promise(schema).parse(dbArena.findOne({}, { sort: { beginDate: -1 } })),
  )
}

export async function getPreviousArena(db: Db, currentArena: z.infer<typeof schema>) {
  const dbArena = getDBArena(db)
  return handlePromiseParser(
    z.promise(schema).parse(
      dbArena.findOne(
        {
          beginDate: {
            $lt: currentArena.beginDate,
          },
        },
        {
          sort: {
            beginDate: -1,
          },
        },
      ),
    ),
    true,
  )
}

export async function getNextArena(db: Db, currentArena: z.infer<typeof schema>) {
  const dbArena = getDBArena(db)
  return handlePromiseParser(
    z.promise(schema).parse(
      dbArena.findOne(
        {
          beginDate: {
            $gt: currentArena.beginDate,
          },
        },
        {
          sort: {
            beginDate: 1,
          },
        },
      ),
    ),
    true,
  )
}

export async function getAllArenas(db: Db) {
  const _schema = schema.pick({ _id: true, beginDate: true, endDate: true })
  const dbArena = getDBArena(db)

  return handlePromiseParser(z.promise(_schema.array()).parse(dbArena.find({}).toArray()))
}
