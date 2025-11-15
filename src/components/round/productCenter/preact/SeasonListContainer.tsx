import type { schema as schemaProduct } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { isRestrictedRating, useProductCenter } from '@/utils/product'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { FIRST_ROUND } from '@/configs/sites'

const STORE_KEY = dataStoreKey.productCenter.season
const PAGE_SIZE = dataNumberPerPage.productCenter.season

type Props = {
  round: string
  data: z.infer<typeof schemaProduct>[]
}

export default function SeasonListContainer({ round, data }: Props) {
  const isFirstRound = round === FIRST_ROUND

  const { displayItems, handleSortChange, getSortButtonClass, getSortIcon } = useProductCenter(
    data,
    PAGE_SIZE,
    STORE_KEY,
  )

  return (
    <>
      <div class="sticky-control mb-2 flex gap-x-2 py-4 md:hidden">
        <button
          class={`btn-default btn btn-outline btn-sm ${getSortButtonClass('type')}`}
          onClick={() => {
            handleSortChange('type')
          }}
        >
          類別
          {getSortIcon('type')}
        </button>
        <button
          class={`btn-default btn btn-outline btn-sm ${getSortButtonClass('rating')}`}
          onClick={() => {
            handleSortChange('rating')
          }}
        >
          分級
          {getSortIcon('rating')}
        </button>
        <button
          class={`btn-default btn btn-outline btn-sm ${getSortButtonClass('voteCount')}`}
          onClick={() => {
            handleSortChange('voteCount')
          }}
        >
          得票數
          {getSortIcon('voteCount')}
        </button>
      </div>
      <table class="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr class="*:px-0">
            <th class="text-center">產品</th>
            <th class="w-1/5 text-center">公司名稱</th>
            <th
              class="w-24 cursor-pointer text-center"
              onClick={() => {
                handleSortChange('type')
              }}
            >
              類別
              {getSortIcon('type')}
            </th>
            <th
              class="w-24 cursor-pointer text-center"
              onClick={() => {
                handleSortChange('rating')
              }}
            >
              分級
              {getSortIcon('rating')}
            </th>
            <th
              class="w-24 cursor-pointer text-center"
              onClick={() => {
                handleSortChange('voteCount')
              }}
            >
              得票數
              {getSortIcon('voteCount')}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr key={item._id}>
                <td class="text-left" data-title="產品">
                  <div class="max-h-12 overflow-y-auto break-all">
                    <ProductLink productId={item._id} />
                  </div>
                  <div class="max-h-14 overflow-y-auto text-sm break-all">{item.description}</div>
                </td>
                <td class="text-left text-wrap" data-title="公司名稱">
                  <CompanyLink round={round} companyId={item.companyId} />
                </td>
                <td class="text-center text-nowrap" data-title="類別">
                  {item.type}
                </td>
                {isRestrictedRating(item.rating) ? (
                  <td
                    class="text-center text-nowrap text-error before:text-base-content"
                    data-title="分級"
                  >
                    {item.rating}
                  </td>
                ) : (
                  <td class="text-center text-nowrap" data-title="分級">
                    &nbsp;
                  </td>
                )}

                <td class="text-center text-nowrap" data-title="得票數">
                  <span class="badge items-baseline badge-soft text-base badge-info">
                    {item.voteCount}
                    {isFirstRound ? (
                      <i class="fa fa-money" aria-hidden="true"></i>
                    ) : (
                      <i class="fa fa-ticket" aria-hidden="true"></i>
                    )}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr class="default-content">
              <td colspan={5}>當季度沒有任何產品上架！</td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore storeKey={STORE_KEY} />
    </>
  )
}
