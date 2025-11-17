import type { z } from 'astro/zod'
import type { schema } from '@/services/dbUserOwnedProduct'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { useStore } from '@nanostores/react'
import { totalAmount } from '@/stores/pagination'

type Product = Pick<z.infer<typeof schema>, 'productId' | 'companyId' | 'amount'>

type Props = {
  round: string
  data: Product[]
}

const STORE_KEY = dataStoreKey.account.product
const PAGE_SIZE = dataNumberPerPage.account.product

export default function ProductList({ round, data }: Props) {
  const $totalAmount = useStore(totalAmount)
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div className="overflow-y-auto">
      <p>總共{$totalAmount[STORE_KEY]}筆</p>
      <table className="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr className="*:px-1">
            <th className="w-50 text-center text-nowrap">公司名稱</th>
            <th className="text-center text-nowrap">產品名稱</th>
            <th className="w-24 text-center text-nowrap">持有數量</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr className="*:px-1" key={item.productId}>
                <td className="truncate text-nowrap" data-title="公司名稱">
                  <CompanyLink round={round} companyId={item.companyId} />
                </td>
                <td className="text-wrap break-all" data-title="產品名稱">
                  <ProductLink productId={item.productId} />
                </td>
                <td className="truncate text-nowrap md:text-center" data-title="持有數量">
                  {item.amount}
                </td>
              </tr>
            ))
          ) : (
            <tr className="default-content">
              <td className="truncate" colSpan={3}>
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
