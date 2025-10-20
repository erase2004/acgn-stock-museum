import { currentPage, isDataLoading, totalAmount } from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { useIntersectionObserver } from 'usehooks-ts'
import { useEffect } from 'preact/hooks'

type Props = {
  total?: number
  pageSize: number
}

export default function LoadMore({ total, pageSize }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)
  const $totalAmount = useStore(totalAmount)
  const { isIntersecting, ref } = useIntersectionObserver({})

  total = total ?? $totalAmount

  const totalPages = Math.ceil(total / pageSize)

  if (!total) return <></>
  if ($currentPage >= totalPages) return <></>

  useEffect(() => {
    if (isIntersecting) {
      if ($currentPage >= totalPages) return
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
