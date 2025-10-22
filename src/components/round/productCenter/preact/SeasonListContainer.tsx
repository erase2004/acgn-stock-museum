import type { schema as schemaProduct } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { isRestrictedRating } from '@/utils/product'
import { currentPage, hasMore } from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { useMemo, useState } from 'preact/hooks'
import { orderBy } from 'lodash-es'

type SortOrder = {
  type?: 1 | 0
  rating?: 1 | 0
  voteCount?: 1 | 0
}

type Props = {
  round: string
  pageSize: number
  data: z.infer<typeof schemaProduct>[]
}

export default function SeasonListContainer({ round, pageSize, data }: Props) {
  const totalAmount = data.length
  const $currentPage = useStore(currentPage)
  const [sortOrder, setSortOrder] = useState<SortOrder>({ voteCount: 0 })

  const displayItems = useMemo(() => {
    let key: keyof SortOrder = 'voteCount'
    let order: 'asc' | 'desc' = 'desc'

    if (typeof sortOrder['type'] === 'number') {
      key = 'type'
      order = sortOrder['type'] ? 'asc' : 'desc'
    }

    if (typeof sortOrder['rating'] === 'number') {
      key = 'rating'
      order = sortOrder['rating'] ? 'asc' : 'desc'
    }

    if (typeof sortOrder['voteCount'] === 'number') {
      key = 'voteCount'
      order = sortOrder['voteCount'] ? 'asc' : 'desc'
    }

    const sorted = orderBy(data, [key], [order])
    const newList = sorted.slice(0, pageSize * $currentPage)
    hasMore.set(newList.length < totalAmount)
    return newList
  }, [data, sortOrder, $currentPage])

  function handleSortChange(key: keyof SortOrder) {
    if (typeof sortOrder[key] === 'number') {
      setSortOrder({
        [key]: sortOrder[key] ? 0 : 1,
      })
    } else {
      setSortOrder({
        [key]: 0,
      })
    }
  }

  function getSortIcon(key: keyof SortOrder) {
    if (typeof sortOrder[key] === 'number') {
      if (sortOrder[key]) {
        return <i class="fa fa-sort-amount-asc ml-1" aria-hidden="true"></i>
      } else {
        return <i class="fa fa-sort-amount-desc ml-1" aria-hidden="true"></i>
      }
    }
    return <></>
  }

  function getSortButtonClass(key: keyof SortOrder) {
    return typeof sortOrder[key] === 'number' ? 'btn-active' : ''
  }

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
            <th class="w-2/5 truncate text-center" title="產品">
              產品
            </th>
            <th class="w-1/5 truncate text-center" title="公司名稱">
              公司名稱
            </th>
            <th
              class="w-24 cursor-pointer truncate text-center"
              title="類別"
              onClick={() => {
                handleSortChange('type')
              }}
            >
              類別
              {getSortIcon('type')}
            </th>
            <th
              class="w-24 cursor-pointer truncate text-center"
              title="分級"
              onClick={() => {
                handleSortChange('rating')
              }}
            >
              分級
              {getSortIcon('rating')}
            </th>
            <th
              class="w-24 cursor-pointer truncate text-center"
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
                <td class="truncate text-left text-nowrap" data-title="公司名稱">
                  <CompanyLink round={round} companyId={item.companyId} />
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
              <td class="text-center" colspan={5}>
                當季度沒有任何產品上架！
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore />
    </>
  )
}
