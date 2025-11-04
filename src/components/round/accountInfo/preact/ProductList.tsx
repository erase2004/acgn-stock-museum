import type { z } from 'astro/zod'
import type { schema } from '@/services/dbUserOwnedProduct'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'

type Product = Pick<z.infer<typeof schema>, 'productId' | 'companyId' | 'amount'>

type Props = {
  round: string
  data: Product[]
}

const STORE_KEY = dataStoreKey.account.product
const PAGE_SIZE = dataNumberPerPage.account.product

export default function ProductList({ round, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div class="overflow-y-auto">
      <table class="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr class="*:px-1">
            <th class="w-50 text-center text-nowrap">公司名稱</th>
            <th class="text-center text-nowrap">產品名稱</th>
            <th class="w-24 text-center text-nowrap">持有數量</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr class="*:px-1" key={item.productId}>
                <td class="truncate text-nowrap" data-title="公司名稱">
                  <CompanyLink round={round} companyId={item.companyId} />
                </td>
                <td class="truncate text-nowrap" data-title="產品名稱">
                  <ProductLink productId={item.productId} />
                </td>
                <td class="truncate text-nowrap md:text-center" data-title="持有數量">
                  {item.amount}
                </td>
              </tr>
            ))
          ) : (
            <tr class="default-content">
              <td class="truncate" colspan={3}>
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
