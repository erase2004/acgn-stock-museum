import CompanyLink from '@/components/common/preact/CompanyLink'

type Props = {
  round: string
  companyId: string
  title: string
  isSeal?: boolean
}

export default function CompanyTitle({ round, companyId, title, isSeal }: Props) {
  return (
    <div className="flex flex-nowrap text-primary">
      <span className="text-nowrap">是「</span>
      <span className="inline-block truncate">
        {isSeal && <span className="badge badge-error">已查封</span>}
        <CompanyLink round={round} companyId={companyId} />
      </span>
      <span className="text-nowrap">」公司的{title}。</span>
    </div>
  )
}
