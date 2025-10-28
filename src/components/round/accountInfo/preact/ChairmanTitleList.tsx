import type { schema as schemaCompany } from '@/services/dbCompanies'
import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'

type Company = z.infer<typeof schemaCompany>

type Props = {
  round: string
  data: Pick<Company, '_id' | 'chairmanTitle'>[]
}

const PAGE_SIZE = dataNumberPerPage.account.chariman
const STORE_KEY = dataStoreKey.account.chairman

export default function ChairmanTitleList({ round, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <>
      {displayItems.length > 0
        ? displayItems.map((item) => (
            <div class="flex flex-nowrap text-primary" key={item._id}>
              <span class="text-nowrap">是「</span>
              <span class="inline-block max-w-[calc(100%-11rem)] truncate">
                <CompanyLink round={round} companyId={item._id} />
              </span>
              <span class="text-nowrap">」公司的「</span>
              <span class="inline-block max-w-[calc(100%-11rem)] truncate">
                {item.chairmanTitle}
              </span>
              <span class="text-nowrap">」</span>
            </div>
          ))
        : '查無資料！'}
      <LoadMore storeKey={STORE_KEY} />
    </>
  )
}
