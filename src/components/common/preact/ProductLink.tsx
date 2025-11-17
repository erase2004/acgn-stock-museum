import { useEffect, useState } from 'react'
import { productDict } from '@/stores/common'
import { useStore } from '@nanostores/react'

const defaultText = '???'

type Props = {
  productId?: string
}

export default function ProductLink({ productId }: Props) {
  const $productDict = useStore(productDict)
  const [html, setHtml] = useState(<span></span>)

  useEffect(() => {
    let displayText: string = defaultText

    if (!productId) {
      setHtml(<span>{displayText}</span>)
      return
    }

    if (!$productDict) {
      setHtml(<span>{displayText}</span>)
      return
    }

    const productData = $productDict[productId]
    if (!productData) {
      setHtml(<span>{displayText}</span>)
      return
    }

    const { productName, url, type } = productData
    displayText = productName || defaultText
    setHtml(
      <a href={url} title={productName} data-product-type={type} target="_blank">
        {displayText}
      </a>,
    )
  }, [productId, $productDict])

  return html
}
