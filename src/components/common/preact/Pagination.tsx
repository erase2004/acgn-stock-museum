import { currentPage, isDataLoading } from '@/stores/pagination'
import { useStore } from '@nanostores/preact'
import { range } from 'lodash-es'

type Props = {
  total: number
  pageSize: number
}

export default function Pagination({ total, pageSize }: Props) {
  const $currentPage = useStore(currentPage)
  const $isDataLoading = useStore(isDataLoading)

  if (!total) return <></>

  const totalPages = Math.ceil(total / pageSize)
  const displayCount = 6

  const pages = (function () {
    const leftmost = Math.floor(displayCount / 2)
    const rightmost = Math.floor((displayCount - 1) / 2)

    if (totalPages <= displayCount) {
      return range(1, totalPages + 1)
    }
    if ($currentPage - leftmost >= 1 && $currentPage + rightmost <= totalPages) {
      return range($currentPage - leftmost, $currentPage + (rightmost + 1))
    }
    if ($currentPage - leftmost < 1) {
      return range(1, displayCount + 1)
    }
    return range(totalPages - (displayCount - 1), totalPages + 1)
  })()

  const setPageNumber = (pageNumber: number) => {
    if ($isDataLoading) return
    if (pageNumber < 1) pageNumber = 1
    if (pageNumber > totalPages) pageNumber = totalPages
    currentPage.set(pageNumber)
  }

  return (
    <div class="flex flex-wrap justify-center gap-x-4 gap-y-2 py-2">
      <div class="join">
        <button class="page-item join-item" title="第一頁" onClick={() => setPageNumber(1)}>
          <i class="fa fa-fast-backward"></i>
        </button>
        <button
          class="page-item join-item"
          title="上一頁"
          onClick={() => setPageNumber($currentPage - 1)}
        >
          <i class="fa fa-backward"></i>
        </button>
        {pages.map((page) => (
          <button
            class={`page-item join-item ${$currentPage === page ? 'btn-active' : ''}`}
            onClick={() => setPageNumber(page)}
          >
            {page}
          </button>
        ))}
        <button
          class="page-item join-item"
          title="下一頁"
          onClick={() => setPageNumber($currentPage + 1)}
        >
          <i class="fa fa-forward"></i>
        </button>
        <button
          class="page-item join-item"
          title="最末頁"
          onClick={() => setPageNumber(totalPages)}
        >
          <i class="fa fa-fast-forward"></i>
        </button>
      </div>
      <form
        class="flex flex-nowrap"
        autocomplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const page = Number(formData.get('page'))

          if (!Number.isNaN(page)) setPageNumber(page)
        }}
      >
        <label class="input input-sm rounded-r-none">
          <span class="label">跳至頁數</span>
          <input class="" type="number" name="page" min="1" max={totalPages} value={$currentPage} />
        </label>
        <button class="btn inline-block rounded-l-none btn-sm btn-primary" type="submit">
          走！
        </button>
      </form>
    </div>
  )
}
