import { z } from 'astro/zod'
import { keyBy } from 'lodash-es'
import { getProductJsonUrl } from '@/libs/routes'
import { schema as schemaProduct } from '@/services/dbProducts'
import { productDict } from '@/stores/common'

type Props = {
  round: string
}

export default function LoadProductJson({ round }: Props) {
  const schema = z.preprocess(
    (value) => {
      // @ts-expect-error: treat value as any
      return { _id: value.i, productName: value.n, type: value.t, url: value.u }
    },
    schemaProduct.pick({
      _id: true,
      productName: true,
      type: true,
      url: true,
    }),
  )

  const jsonUrl = getProductJsonUrl(round)
  fetch(jsonUrl).then(async (response) => {
    const result = await z.promise(schema.array()).parse(response.json())
    const data = keyBy(result, '_id')
    productDict.set(data)
  })

  return <></>
}
