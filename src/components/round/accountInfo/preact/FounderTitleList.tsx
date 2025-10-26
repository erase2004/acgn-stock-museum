import type { schema as schemaCompany } from '@/services/dbCompanies'
import type { z } from 'astro/zod'
import CompanyTitle from './CompanyTitle'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/hooks'

type Company = z.infer<typeof schemaCompany>

type Props = {
  round: string
  data: Pick<Company, '_id' | 'isSeal'>[]
}

const PAGE_SIZE = 10
const STORE_KEY = 'founder-title'

export default function FounderTitleList({ round, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <>
      {displayItems.length > 0
        ? displayItems.map((item) => (
            <CompanyTitle
              key={item._id}
              round={round}
              companyId={item._id}
              isSeal={item.isSeal}
              title="創立人"
            />
          ))
        : '查無資料！'}
      <LoadMore storeKey={STORE_KEY} />
    </>
  )
}
