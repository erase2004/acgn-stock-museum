// 任意變數資料集
import { type Db, type Document, type WithId } from 'mongodb'

declare module 'mongodb' {
  interface Collection<TSchema extends Document = Document> {
    get(key: string): Promise<WithId<TSchema> | null>
    has(key: string): Promise<boolean>
  }
}

export function getDBVariables(db: Db) {
  const dbVariables = db.collection('variables')

  dbVariables.get = async function (key: string) {
    const variableData = await this.findOne({
      // @ts-expect-error: key is valid ObjectId
      _id: key,
    })

    return variableData ? variableData.value : null
  }

  dbVariables.has = async function (key: string) {
    return !!(await this.findOne({
      // @ts-expect-error: key is valid ObjectId
      _id: key,
    }))
  }

  return dbVariables
}
