import { z } from 'astro/zod'
import { keyBy } from 'lodash-es'
import { getCompanyJsonUrl } from '@/libs/routes'
import { schema as schemaCompanyArchive } from '@/services/dbCompanyArchive'
import { companyArchiveDict } from '@/stores/common'

type Props = {
  round: string
}

export default function LoadCompanyJson({ round }: Props) {
  const schema = z.preprocess((value) => {
    // @ts-expect-error: treat value as any
    return { _id: value.u, companyName: value.c, status: value.s }
  }, schemaCompanyArchive)

  const jsonUrl = getCompanyJsonUrl(round)
  fetch(jsonUrl).then(async (response) => {
    const result = await z.promise(schema.array()).parse(response.json())
    const data = keyBy(result, '_id')
    companyArchiveDict.set(data)
  })

  return <></>
}
