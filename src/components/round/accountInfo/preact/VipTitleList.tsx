import type { schema as schemaVip } from '@/services/dbVips'
import type { z } from 'astro/zod'
import CompanyTitle from './CompanyTitle'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/hooks'

type VIP = z.infer<typeof schemaVip>

type Props = {
  round: string
  data: Pick<VIP, 'companyId' | 'level'>[]
}

const PAGE_SIZE = 10
const STORE_KEY = 'vip-title'

export default function VipTitleList({ round, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <>
      {displayItems.length > 0
        ? displayItems.map((item) => (
            <CompanyTitle
              key={item.companyId}
              round={round}
              companyId={item.companyId}
              title={`Level ${item.level} VIP`}
            />
          ))
        : '查無資料！'}
      <LoadMore storeKey={STORE_KEY} />
    </>
  )
}
