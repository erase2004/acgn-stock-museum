import type { schema as schemaProduct } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { isRestrictedRating, useProductCenter } from '@/utils/product'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'

const STORE_KEY = dataStoreKey.productCenter.company
const PAGE_SIZE = dataNumberPerPage.productCenter.company

type Props = {
  data: z.infer<typeof schemaProduct>[]
}

export default function CompanyListContainerForFirstRound({ data }: Props) {
  const { displayItems, handleSortChange, getSortButtonClass, getSortIcon } = useProductCenter(
    data,
    PAGE_SIZE,
    STORE_KEY,
    { likeCount: 0 },
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
        <button
          class={`btn-default btn btn-outline btn-sm ${getSortButtonClass('likeCount')}`}
          onClick={() => {
            handleSortChange('likeCount')
          }}
        >
          市場評價
          {getSortIcon('likeCount')}
        </button>
      </div>
      <table class="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr>
            <th class="text-center">產品</th>
            <th
              class="w-24 cursor-pointer px-0 text-center"
              onClick={() => {
                handleSortChange('type')
              }}
            >
              類別
              {getSortIcon('type')}
            </th>
            <th
              class="w-24 cursor-pointer px-0 text-center"
              onClick={() => {
                handleSortChange('rating')
              }}
            >
              分級
              {getSortIcon('rating')}
            </th>
            <th
              class="w-24 cursor-pointer px-0 text-center"
              onClick={() => {
                handleSortChange('voteCount')
              }}
            >
              得票數
              {getSortIcon('voteCount')}
            </th>
            <th
              class="w-24 cursor-pointer px-0 text-center"
              onClick={() => {
                handleSortChange('likeCount')
              }}
            >
              市場評價
              {getSortIcon('likeCount')}
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
                    <i class="fa fa-money" aria-hidden="true"></i>
                  </span>
                </td>

                <td class="text-center text-nowrap" data-title="市場評價">
                  <span class="badge items-baseline badge-soft text-base badge-info">
                    {item.likeCount}
                    <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr class="default-content">
              <td colspan={5}>這家公司尚未推出任何產品！</td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore storeKey={STORE_KEY} />
    </>
  )
}
