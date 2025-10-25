import type { z } from 'astro/zod'
import type { schema } from '@/services/dbDirectors'
import CompanyLink from '@/components/common/preact/CompanyLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/account'

type Props = {
  round: string
  data: z.infer<typeof schema>[]
}

const STORE_KEY = 'stock-info'
const PAGE_SIZE = 10

export default function StockList({ round, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div class="overflow-y-auto">
      <table class="table-base table-pin-rows table">
        <thead>
          <tr class="*:px-1">
            <th class="text-center text-nowrap">公司名稱</th>
            <th class="w-24 text-center text-nowrap">持股數</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr class="*:px-1" key={item.companyId}>
                <td class="truncate text-left" data-title="公司名稱">
                  <CompanyLink round={round} companyId={item.companyId} />
                </td>
                <td class="truncate text-right text-nowrap" data-title="持股數">
                  {item.stocks}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td class="truncate text-center" colspan={2}>
                查無資料！
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore storeKey={STORE_KEY} />
    </div>
  )
}
