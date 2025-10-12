import { MongoClient } from 'mongodb'
import { getRoundData } from './routes'
import { DB_URI } from 'astro:env/server'

export function getConnection(round: string) {
  const roundData = getRoundData(round)

  if (!roundData) throw new Error('Round is not valid')
  if (roundData.disabled) throw new Error('Round lacks of data')

  return new MongoClient(DB_URI).db(roundData.dbname)
}
