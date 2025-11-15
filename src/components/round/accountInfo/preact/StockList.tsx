import type { z } from 'astro/zod'
import type { stocksWithCountSchema } from '@/services/dbDirectors'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { getCompanyUrl } from '@/libs/routes'
import { useStore } from '@nanostores/preact'
import { totalAmount } from '@/stores/pagination'

type Stock = z.infer<typeof stocksWithCountSchema>[number]['data'][number]

type Props = {
  round: string
  data: Stock[]
}

const STORE_KEY = dataStoreKey.account.stock
const PAGE_SIZE = dataNumberPerPage.account.stock

export default function StockList({ round, data }: Props) {
  const $totalAmount = useStore(totalAmount)
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div class="overflow-y-auto">
      <p>總共{$totalAmount[STORE_KEY]}筆</p>
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
                  <a
                    href={getCompanyUrl(round, item.companyId)}
                    class={item.isSeal ? 'text-error' : ''}
                  >
                    {item.companyName}
                  </a>
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
