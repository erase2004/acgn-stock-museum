import { z } from 'astro/zod'
import { getCompanyUrl } from '@/libs/routes'
import { useEffect, useState } from 'preact/hooks'
import { schema as schemaCompanyArchive } from '@/services/dbCompanyArchive'
import { getCompany } from '@/libs/request'

const defaultText = '???'

type Props = {
  round: string
  companyId?: string
}

export default function CompanyLink({ round, companyId }: Props) {
  const [html, setHtml] = useState(<span></span>)

  useEffect(() => {
    let displayText: string = defaultText

    if (!companyId) {
      setHtml(<span>{displayText}</span>)
      return
    }

    getCompany(round, companyId)
      .then(async (response) => {
        const { status, companyName } = await z.promise(schemaCompanyArchive).parse(response.json())

        displayText = companyName || defaultText

        if (status === 'market') {
          const path = getCompanyUrl(round, companyId)
          setHtml(<a href={path}>{displayText}</a>)
          return
        }

        setHtml(<span>{displayText}</span>)
      })
      .catch(() => {
        displayText = defaultText

        setHtml(<span>{displayText}</span>)
      })
  }, [companyId])

  return html
}
