import { z } from 'astro/zod'
import { keyBy } from 'lodash-es'
import { getProductJsonUrl } from '@/libs/routes'
import { schema as schemaProduct } from '@/services/dbProducts'
import { productDict } from '@/stores/common'

type Props = {
  round: string
}

export default function LoadProductJson({ round }: Props) {
  const jsonUrl = getProductJsonUrl(round)
  const schema = schemaProduct.pick({
    _id: true,
    productName: true,
    type: true,
    url: true,
  })

  fetch(jsonUrl).then(async (response) => {
    const result = await z.promise(schema.array()).parse(response.json())
    const data = keyBy(result, '_id')
    productDict.set(data)
  })

  return <></>
}
