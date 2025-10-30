import LoadMore from '@/components/common/preact/LoadMore'
import UserLink from '@/components/common/preact/UserLink'
import type { schema } from '@/services/dbDirectors'
import type { z } from 'astro/zod'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { getStockPercentage } from '@/utils/company'

const STORE_KEY = dataStoreKey.company.director
const PAGE_SIZE = dataNumberPerPage.company.director

type Director = z.infer<typeof schema>
type Props = {
  round: string
  totalRelease: number
  data: Director[]
}

export default function DirectorList({ round, totalRelease, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div class="company-panel-table max-h-72 border-t *:px-4 md:*:gap-x-6">
      <div class="sticky-control hidden grid-cols-12 text-center text-nowrap md:grid">
        <div class="col-span-3">使用者帳號</div>
        <div class="col-span-1">股份數</div>
        <div class="col-span-1">比例</div>
        <div class="col-span-7">留言</div>
      </div>
      {displayItems.length > 0 ? (
        displayItems.map((item) => (
          <div key={item.userId} class="grid grid-cols-12">
            <p class="col-span-4 md:hidden">使用者帳號</p>
            <div class="col-span-8 truncate md:col-span-3">
              <UserLink round={round} userId={item.userId} />
            </div>
            <p class="col-span-4 md:hidden">股份數</p>
            <div class="col-span-8 truncate text-right md:col-span-1">{item.stocks}</div>
            <p class="col-span-4 md:hidden">比例</p>
            <div class="col-span-8 truncate text-right md:col-span-1">
              {getStockPercentage(item.stocks, totalRelease)}%
            </div>
            <p class="col-span-4 md:hidden">留言</p>
            <div class="col-span-8 break-all md:col-span-7">{item.message || '無'}</div>
          </div>
        ))
      ) : (
        <p class="text-center">沒有任何董事！</p>
      )}
      <LoadMore storeKey={STORE_KEY} />
    </div>
  )
}
