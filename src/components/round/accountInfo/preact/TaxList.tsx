import type { z } from 'astro/zod'
import type { schema } from '@/services/dbTaxes'
import LoadMore from '@/components/common/preact/LoadMore'
import { formatDateTimeText } from '@/libs/timeFormat'
import { currencyFormat } from '@/utils/helpers'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'

type Props = {
  data: z.infer<typeof schema>[]
}

const STORE_KEY = dataStoreKey.account.tax
const PAGE_SIZE = dataNumberPerPage.account.tax

export default function TaxList({ data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div class="overflow-y-auto">
      <table class="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr class="*:px-1">
            <th class="w-40 text-center text-nowrap">繳稅期限</th>
            <th class="text-center text-nowrap">股票資產稅</th>
            <th class="text-center text-nowrap">現金資產稅</th>
            <th class="text-center text-nowrap">殭屍稅</th>
            <th class="text-center text-nowrap">逾期罰金</th>
            <th class="text-center text-nowrap">已繳納</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr class="*:px-1" key={item._id}>
                <td class="text-center text-wrap" data-title="繳稅期限">
                  {formatDateTimeText(item.expireDate)}
                </td>
                <td class="text-right text-wrap" data-title="股票資產稅" title={`${item.stockTax}`}>
                  $ {currencyFormat(item.stockTax)}
                </td>
                <td class="text-right text-wrap" data-title="現金資產稅" title={`${item.moneyTax}`}>
                  $ {currencyFormat(item.moneyTax)}
                </td>
                <td class="text-right text-wrap" data-title="殭屍稅" title={`${item.zombieTax}`}>
                  $ {currencyFormat(item.zombieTax)}
                </td>
                <td class="text-right text-wrap" data-title="逾期罰金" title={`${item.fine}`}>
                  $ {currencyFormat(item.fine)}
                </td>
                <td class="text-right text-wrap" data-title="已繳納" title={`${item.paid}`}>
                  $ {currencyFormat(item.paid)}
                </td>
              </tr>
            ))
          ) : (
            <tr class="default-content">
              <td class="truncate" colspan={6}>
                目前沒有需要繳納的稅金！
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore storeKey={STORE_KEY} />
    </div>
  )
}
