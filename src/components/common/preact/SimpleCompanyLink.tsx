import { getCompanyUrl } from '@/libs/routes'

const defaultText = '???'

type Props = {
  round: string
  companyId?: string
  companyName: string
  isSeal: boolean
}

export default function SimpleCompanyLink({ round, companyId, companyName, isSeal }: Props) {
  if (!companyId) {
    return <span>{defaultText}</span>
  }

  return (
    <a href={getCompanyUrl(round, companyId)} className={isSeal ? 'text-error' : ''}>
      {companyName || defaultText}
    </a>
  )
}
