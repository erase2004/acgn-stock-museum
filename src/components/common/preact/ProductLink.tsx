import { z } from 'astro/zod'
import { useEffect, useState } from 'preact/hooks'
import { schema as schemaProduct } from '@/services/dbProducts'
import { getProduct } from '@/libs/request'

const defaultText = '???'

type Props = {
  round: string
  productId?: string
}

export default function ProductLink({ round, productId }: Props) {
  const [html, setHtml] = useState(<span></span>)

  useEffect(() => {
    let displayText: string = defaultText

    if (!productId) {
      setHtml(<span>{displayText}</span>)
      return
    }

    getProduct(round, productId)
      .then(async (response) => {
        const { productName, url, type } = await z.promise(schemaProduct).parse(response.json())

        displayText = productName || defaultText

        setHtml(
          <a href={url} title={productName} data-product-type={type} target="_blank">
            {displayText}
          </a>,
        )
        return
      })
      .catch(() => {
        displayText = defaultText

        setHtml(<span>{displayText}</span>)
      })
  }, [productId])

  return html
}
