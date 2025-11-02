import {
  currentPage,
  isDataLoading,
  hasMore,
  currentAmount,
  totalAmount,
} from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { useIntersectionObserver } from 'usehooks-ts'
import { useEffect } from 'preact/hooks'
import { currencyFormat } from '@/utils/helpers'

type Props = {
  storeKey: string
}

export default function LoadMore({ storeKey }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const $hasMore = useStore(hasMore)
  const $currentAmount = useStore(currentAmount)
  const $totalAmount = useStore(totalAmount)

  const { isIntersecting, ref } = useIntersectionObserver({})

  if (!$hasMore[storeKey]) return <></>

  useEffect(() => {
    if (isIntersecting) {
      if (!$hasMore[storeKey]) return
      if ($isDataLoading[storeKey]) return

      currentPage.setKey(storeKey, $currentPage[storeKey] + 1)
    }
  }, [isIntersecting])

  return (
    <div ref={ref} class="flex flex-row justify-center gap-x-2 py-4">
      <span>
        載入更多資料中 ({currencyFormat($currentAmount[storeKey])} /{' '}
        {currencyFormat($totalAmount[storeKey])})
      </span>
      <span class="loading loading-lg loading-dots"></span>
    </div>
  )
}
