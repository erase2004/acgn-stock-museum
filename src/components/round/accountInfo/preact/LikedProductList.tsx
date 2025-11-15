import type { z } from 'astro/zod'
import type { schema } from '@/services/dbProductLike'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { useDisplayItems } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { useStore } from '@nanostores/preact'
import { totalAmount } from '@/stores/pagination'

type ProductLike = z.infer<typeof schema>

type Props = {
  round: string
  data: ProductLike[]
}

const STORE_KEY = dataStoreKey.account.productLike
const PAGE_SIZE = dataNumberPerPage.account.productLike

export default function LikedProductList({ round, data }: Props) {
  const $totalAmount = useStore(totalAmount)
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div class="overflow-y-auto">
      <p>總共{$totalAmount[STORE_KEY]}筆</p>
      <table class="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr class="*:px-1">
            <th class="w-50 text-center text-nowrap">公司名稱</th>
            <th class="text-center text-nowrap">產品名稱</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr class="*:px-1" key={item.productId}>
                <td class="truncate text-nowrap" data-title="公司名稱">
                  <CompanyLink round={round} companyId={item.companyId} />
                </td>
                <td class="text-wrap break-all" data-title="產品名稱">
                  <ProductLink productId={item.productId} />
                </td>
              </tr>
            ))
          ) : (
            <tr class="default-content">
              <td class="truncate" colspan={2}>
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
