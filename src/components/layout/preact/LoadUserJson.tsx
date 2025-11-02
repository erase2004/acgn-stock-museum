import { z } from 'astro/zod'
import { keyBy } from 'lodash-es'
import { getUserJsonUrl } from '@/libs/routes'
import { schema as schemaUserArchive } from '@/services/dbUserArchive'
import { userArchiveDict } from '@/stores/common'

type Props = {
  round: string
}

export default function LoadUserJson({ round }: Props) {
  const jsonUrl = getUserJsonUrl(round)
  const schema = schemaUserArchive.pick({
    _id: true,
    name: true,
    status: true,
    validateType: true,
  })

  fetch(jsonUrl).then(async (response) => {
    const result = await z.promise(schema.array()).parse(response.json())
    const data = keyBy(result, '_id')
    userArchiveDict.set(data)
  })

  return <></>
}
