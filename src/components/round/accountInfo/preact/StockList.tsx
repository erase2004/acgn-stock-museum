import type { z } from 'astro/zod'
import type { stockSchemaExtendWithCompany } from '@/services/dbDirectors'
import LoadMore from '@/components/common/preact/LoadMore'
import SimpleCompanyLink from '@/components/common/preact/SimpleCompanyLink'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { useStore } from '@nanostores/react'
import { totalAmount } from '@/stores/pagination'

type Stock = z.infer<typeof stockSchemaExtendWithCompany>

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
    <div className="overflow-y-auto">
      <p>總共{$totalAmount[STORE_KEY]}筆</p>
      <table className="table-base table-pin-rows table">
        <thead>
          <tr className="*:px-1">
            <th className="text-center text-nowrap">公司名稱</th>
            <th className="w-24 text-center text-nowrap">持股數</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr className="*:px-1" key={item.companyId}>
                <td className="truncate text-left" data-title="公司名稱">
                  <SimpleCompanyLink {...item} round={round} />
                </td>
                <td className="truncate text-right text-nowrap" data-title="持股數">
                  {item.stocks}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="truncate text-center" colSpan={2}>
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
