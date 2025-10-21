import { currentPage, isDataLoading, hasMore } from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { useIntersectionObserver } from 'usehooks-ts'
import { useEffect } from 'preact/hooks'

export default function LoadMore() {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const $hasMore = useStore(hasMore)
  const { isIntersecting, ref } = useIntersectionObserver({})

  if (!$hasMore) return <></>

  useEffect(() => {
    if (isIntersecting) {
      if (!$hasMore) return
      if ($isDataLoading) return

      currentPage.set($currentPage + 1)
    }
  }, [isIntersecting])

  return (
    <div ref={ref} class="flex flex-row justify-center gap-x-2 py-4">
      <span>載入更多資料中</span>
      <span class="loading loading-lg loading-dots"></span>
    </div>
  )
}
