import type { schema as schemaProduct } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { isRestrictedRating, useProductCenter } from '@/utils/product'

type Props = {
  round: string
  pageSize: number
  data: z.infer<typeof schemaProduct>[]
}

export default function SeasonListContainer({ round, pageSize, data }: Props) {
  const { displayItems, handleSortChange, getSortButtonClass, getSortIcon } = useProductCenter(
    data,
    pageSize,
  )

  return (
    <>
      <div class="mb-2 flex gap-x-2 md:hidden">
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
          推薦數
          {getSortIcon('voteCount')}
        </button>
      </div>
      <table class="table-base custom-responsive-table-md table">
        <thead>
          <tr>
            <th class="truncate text-center" title="產品">
              產品
            </th>
            <th
              class="w-24 cursor-pointer truncate px-0 text-center"
              title="類別"
              onClick={() => {
                handleSortChange('type')
              }}
            >
              類別
              {getSortIcon('type')}
            </th>
            <th
              class="w-24 cursor-pointer truncate px-0 text-center"
              title="分級"
              onClick={() => {
                handleSortChange('rating')
              }}
            >
              分級
              {getSortIcon('rating')}
            </th>
            <th
              class="w-24 cursor-pointer truncate px-0 text-center"
              title="得票數"
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
                    <ProductLink round={round} productId={item._id} />
                  </div>
                  <div class="max-h-14 overflow-y-auto text-sm! break-all">{item.description}</div>
                </td>
                <td class="truncate text-center text-nowrap" data-title="類別">
                  {item.type}
                </td>
                {isRestrictedRating(item.rating) ? (
                  <td
                    class="truncate text-center text-nowrap text-error before:text-base-content"
                    data-title="分級"
                  >
                    {item.rating}
                  </td>
                ) : (
                  <td class="truncate text-center text-nowrap" data-title="分級">
                    &nbsp;
                  </td>
                )}

                <td class="truncate text-center text-nowrap" data-title="得票數">
                  <button class="btn btn-sm btn-primary" type="button" disabled={true}>
                    {item.voteCount}
                    <i class="fa fa-ticket" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr class="default-content">
              <td class="text-center" colspan={4}>
                這家公司尚未推出任何產品！
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore />
    </>
  )
}
