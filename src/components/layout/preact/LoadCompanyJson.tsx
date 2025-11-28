import { z } from 'astro/zod'
import { keyBy } from 'lodash-es'
import { getCompanyJsonUrl } from '@/libs/routes'
import { schema as schemaCompanyArchive } from '@/services/dbCompanyArchive'
import { companyArchiveDict } from '@/stores/common'

type Props = {
  round: string
}

export default function LoadCompanyJson({ round }: Props) {
  const schema = z.preprocess(
    (value) => {
      // @ts-expect-error: treat value as any
      return { _id: value.u, companyName: value.c, status: value.s }
    },
    schemaCompanyArchive.pick({
      _id: true,
      companyName: true,
      status: true,
    }),
  )

  const jsonUrl = getCompanyJsonUrl(round)
  import(jsonUrl).then((module) => {
    const result = schema.array().parse(module.data)
    const data = keyBy(result, '_id')
    companyArchiveDict.set(data)
  })

  return <></>
}
