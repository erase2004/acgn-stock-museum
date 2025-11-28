import { z } from 'astro/zod'
import { keyBy } from 'lodash-es'
import { getUserJsonUrl } from '@/libs/routes'
import { schema as schemaUserArchive } from '@/services/dbUserArchive'
import { userArchiveDict } from '@/stores/common'

type Props = {
  round: string
}

export default function LoadUserJson({ round }: Props) {
  const schema = z.preprocess(
    (value) => {
      // @ts-expect-error: treat value as any
      return { _id: value.i, name: value.n, status: value.s, validateType: value.t }
    },
    schemaUserArchive.pick({
      _id: true,
      name: true,
      status: true,
      validateType: true,
    }),
  )

  const jsonUrl = getUserJsonUrl(round)
  import(/* @vite-ignore */ jsonUrl).then((module) => {
    const result = schema.array().parse(module.data)
    const data = keyBy(result, '_id')
    userArchiveDict.set(data)
  })

  return <></>
}
