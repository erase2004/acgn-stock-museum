import type { z } from 'astro/zod'
import type { schema as schemaProduct } from '@/services/dbProducts'
import { currentPage, hasMore } from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { useMemo, useState } from 'preact/hooks'
import { orderBy } from 'lodash-es'

type SortOrder = {
  type?: 1 | 0
  rating?: 1 | 0
  voteCount?: 1 | 0
}

export function isRestrictedRating(rating: string) {
  return rating === '18禁'
}

export function useProductCenter(data: z.infer<typeof schemaProduct>[], pageSize: number) {
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

  return {
    displayItems,
    handleSortChange,
    getSortIcon,
    getSortButtonClass,
  }
}
