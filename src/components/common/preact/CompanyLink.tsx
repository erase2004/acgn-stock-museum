import { getCompanyUrl } from '@/libs/routes'
import { useEffect, useState } from 'react'
import { companyArchiveDict } from '@/stores/common'
import { useStore } from '@nanostores/react'

const defaultText = '???'

type Props = {
  round: string
  companyId?: string
}

export default function CompanyLink({ round, companyId }: Props) {
  const $companyArchiveDict = useStore(companyArchiveDict)
  const [html, setHtml] = useState(<span></span>)

  useEffect(() => {
    let displayText: string = defaultText

    if (!companyId) {
      setHtml(<span>{displayText}</span>)
      return
    }

    if (!$companyArchiveDict) {
      setHtml(<span>{displayText}</span>)
      return
    }

    const companyData = $companyArchiveDict[companyId]

    if (!companyData) {
      setHtml(<span>{displayText}</span>)
      return
    }

    const { status, companyName } = companyData
    displayText = companyName || defaultText

    if (status === 'market') {
      const path = getCompanyUrl(round, companyId)
      setHtml(<a href={path}>{displayText}</a>)
      return
    }

    setHtml(<span>{displayText}</span>)
  }, [companyId, $companyArchiveDict])

  return html
}
