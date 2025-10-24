import { currentPage, hasMore } from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { useMemo } from 'preact/hooks'

export function useDisplayItems<T>(data: T[], storeKey: string, pageSize: number) {
  const totalAmount = data.length
  const $currentPage = useStore(currentPage)

  const displayItems = useMemo(() => {
    const newList = data.slice(0, pageSize * $currentPage[storeKey])
    hasMore.setKey(storeKey, newList.length < totalAmount)
    return newList
  }, [data, $currentPage[storeKey]])

  return displayItems
}
