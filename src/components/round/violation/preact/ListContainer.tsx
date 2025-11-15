import Violator from './Violator'
import { formatDateTimeText } from '@/libs/timeFormat'
import { stateBadgeClass, stateDisplayName, categoryDisplayName } from '@/utils/violation'
import { items } from '@/stores/violation'
import { useStore } from '@nanostores/preact'
import { getViolationCaseUrl } from '@/libs/routes'
import { totalAmount } from '@/stores/pagination'

type Props = {
  round: string
  storeKey: string
}

export default function ListContainer({ round, storeKey }: Props) {
  const $totalAmount = useStore(totalAmount)
  const $items = useStore(items)

  return (
    <div class="relative flex flex-col gap-y-6">
      <p class="-mb-4">總共{$totalAmount[storeKey]}筆</p>
      {$items.length > 0 ? (
        $items.map(
          ({
            _id,
            state,
            category,
            createdAt,
            updatedAt,
            violators,
            descriptionDigest,
            descriptionOmittedLength,
          }) => (
            <div class="card overflow-hidden border border-base-content/25 shadow-xl" key={_id}>
              <div class="card-title flex-col items-start border-b border-base-content/25 bg-base-200 p-4">
                <div class="flex items-center gap-x-2 text-xl">
                  {/* TODO: isReportedByCurrentUser style */}
                  <span class={`badge ${stateBadgeClass(state)}`}>{stateDisplayName(state)}</span>
                  <span class="font-normal">{categoryDisplayName(category)}</span>
                </div>
                <div class="flex w-full flex-col items-start font-normal lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    舉報時間：<span class="text-nowrap">{formatDateTimeText(createdAt)}</span>
                  </div>
                  <div>
                    更新時間：<span class="text-nowrap">{formatDateTimeText(updatedAt)}</span>
                  </div>
                  <div>
                    案件識別碼：<span class="text-nowrap">{_id}</span>
                  </div>
                </div>
              </div>
              <div class="card-body flex-col border-b border-base-content/25 text-base lg:flex-row">
                <div class="lg:w-5/12">
                  <p class="mb-1 text-xl">違規名單</p>
                  <ul class="break-all">
                    {violators.map((violator) => (
                      <li key={violator.violatorId}>
                        <Violator {...violator} round={round} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div class="lg:w-7/12">
                  <p class="mb-1 text-xl">案件描述</p>
                  {descriptionDigest}
                  {descriptionOmittedLength > 0 && <em>(…下略 {descriptionOmittedLength} 字)</em>}
                </div>
              </div>
              <div class="card-actions justify-end bg-base-200 p-4">
                <a
                  class="btn btn-primary hover:no-underline"
                  href={getViolationCaseUrl(round, _id)}
                >
                  詳細內容
                </a>
              </div>
            </div>
          ),
        )
      ) : (
        <div class="self-center">沒有違規案件！</div>
      )}
    </div>
  )
}
