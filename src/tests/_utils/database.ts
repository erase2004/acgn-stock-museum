import { MongoClient } from 'mongodb'
import { getRoundData } from '@/libs/routes'

export function getConnection(round: string) {
  const roundData = getRoundData(round)

  if (!roundData) throw new Error('Round is not valid')
  if (roundData.disabled) throw new Error('Round lacks of data')

  return new MongoClient(process.env.DB_URI ?? '').db(roundData.dbname)
}
