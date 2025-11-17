import type { z } from 'astro/zod'
import type { schema as schemaProduct } from '@/services/dbProducts'
import { useMemo, useState } from 'react'
import { orderBy } from 'lodash-es'

type SortOrder<T = 1 | 0> = {
  type?: T
  rating?: T
  voteCount?: T
  likeCount?: T
}

export function isRestrictedRating(rating: string) {
  return rating === '18禁'
}

export function useProductCenter(
  data: z.infer<typeof schemaProduct>[],
  defaultOrder: SortOrder = { voteCount: 0 },
) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder)

  const sortedData = useMemo(() => {
    const keys: (keyof SortOrder)[] = []
    const orders: ('asc' | 'desc')[] = []

    Object.entries(sortOrder).forEach(([type, value]) => {
      if (typeof value === 'number') {
        // @ts-expect-error: type should be keyof SortOrder
        keys.push(type)
        orders.push(value ? 'asc' : 'desc')
      }
    })

    return orderBy(data, keys, orders)
  }, [data, sortOrder])

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
        return <i className="fa fa-sort-amount-asc ml-1" aria-hidden="true"></i>
      } else {
        return <i className="fa fa-sort-amount-desc ml-1" aria-hidden="true"></i>
      }
    }
    return <></>
  }

  function getSortButtonClass(key: keyof SortOrder) {
    return typeof sortOrder[key] === 'number' ? 'btn-active' : ''
  }

  return {
    displayItems: sortedData,
    handleSortChange,
    getSortIcon,
    getSortButtonClass,
  }
}
