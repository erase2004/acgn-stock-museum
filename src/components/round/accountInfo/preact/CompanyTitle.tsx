import CompanyLink from '@/components/common/preact/CompanyLink'

type Props = {
  round: string
  companyId: string
  title: string
  isSeal?: boolean
}

export default function CompanyTitle({ round, companyId, title, isSeal }: Props) {
  return (
    <div class="flex flex-nowrap text-primary">
      <span class="text-nowrap">是「</span>
      <span class="inline-block truncate">
        {isSeal && <span class="badge badge-error">已查封</span>}
        <CompanyLink round={round} companyId={companyId} />
      </span>
      <span class="text-nowrap">」公司的{title}。</span>
    </div>
  )
}
