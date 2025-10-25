// 最萌亂鬥大賽資料集
import type { Db } from 'mongodb'
import { z } from 'astro/zod'
import { handlePromiseParser } from '@/utils/helpers'
import { datetime, objectId } from './schema'

export const schema = z.object({
  _id: objectId,
  /** 起始日期 */
  beginDate: datetime,
  /** 結束日期 */
  endDate: datetime,
  /** 報名截止日期 */
  joinEndDate: datetime,
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
  )
}
