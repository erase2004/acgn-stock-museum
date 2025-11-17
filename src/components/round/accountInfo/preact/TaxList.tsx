import type { z } from 'astro/zod'
import type { schema } from '@/services/dbTaxes'
import LoadMore from '@/components/common/preact/LoadMore'
import { formatDateTimeText } from '@/libs/timeFormat'
import { currencyFormat } from '@/utils/helpers'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { beforeTaxSeperatedRounds } from '@/configs/sites'

type Props = {
  round: string
  data: z.infer<typeof schema>[]
}

const STORE_KEY = dataStoreKey.account.tax
const PAGE_SIZE = dataNumberPerPage.account.tax

export default function TaxList({ round, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div className="overflow-y-auto">
      <table className="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr className="*:px-1">
            <th className="w-40 text-center text-nowrap">繳稅期限</th>
            {beforeTaxSeperatedRounds.includes(round) ? (
              <th className="text-center text-nowrap">財稅額</th>
            ) : (
              <>
                <th className="text-center text-nowrap">股票資產稅</th>
                <th className="text-center text-nowrap">現金資產稅</th>
              </>
            )}
            <th className="text-center text-nowrap">殭屍稅</th>
            <th className="text-center text-nowrap">逾期罰金</th>
            <th className="text-center text-nowrap">已繳納</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr className="*:px-1" key={item._id}>
                <td className="text-center text-wrap" data-title="繳稅期限">
                  {formatDateTimeText(item.expireDate)}
                </td>
                {beforeTaxSeperatedRounds.includes(round) ? (
                  <td className="text-right text-wrap" data-title="財稅額">
                    $ {currencyFormat(item.tax)}
                  </td>
                ) : (
                  <>
                    <td className="text-right text-wrap" data-title="股票資產稅">
                      $ {currencyFormat(item.stockTax)}
                    </td>
                    <td className="text-right text-wrap" data-title="現金資產稅">
                      $ {currencyFormat(item.moneyTax)}
                    </td>
                  </>
                )}
                <td className="text-right text-wrap" data-title="殭屍稅">
                  $ {currencyFormat(item.zombieTax)}
                </td>
                <td className="text-right text-wrap" data-title="逾期罰金">
                  $ {currencyFormat(item.fine)}
                </td>
                <td className="text-right text-wrap" data-title="已繳納">
                  $ {currencyFormat(item.paid)}
                </td>
              </tr>
            ))
          ) : (
            <tr className="default-content">
              <td className="truncate" colSpan={6}>
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
