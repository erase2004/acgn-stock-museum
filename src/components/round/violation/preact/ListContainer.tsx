import Violator from './Violator'
import { Virtuoso } from 'react-virtuoso'
import { formatDateTimeText } from '@/libs/timeFormat'
import { stateBadgeClass, stateDisplayName, categoryDisplayName } from '@/utils/violation'
import { items } from '@/stores/violation'
import { useStore } from '@nanostores/react'
import { getViolationCaseUrl } from '@/libs/routes'

type Props = {
  round: string
}

export default function ListContainer({ round }: Props) {
  const $items = useStore(items)

  return (
    <>
      <Virtuoso
        useWindowScroll
        className="min-h-8"
        data={$items}
        components={{
          List({ children, ...props }) {
            return (
              <div {...props} className="flex flex-col gap-y-6">
                {children}
              </div>
            )
          },
          EmptyPlaceholder() {
            return <div className="self-center">沒有違規案件！</div>
          },
        }}
        itemContent={(
          _,
          {
            _id,
            state,
            category,
            createdAt,
            updatedAt,
            violators,
            descriptionDigest,
            descriptionOmittedLength,
          },
        ) => (
          <div className="card overflow-hidden border border-base-content/25 shadow-xl" key={_id}>
            <div className="card-title flex-col items-start border-b border-base-content/25 bg-base-200 p-4">
              <div className="flex items-center gap-x-2 text-xl">
                <span className={`badge ${stateBadgeClass(state)}`}>{stateDisplayName(state)}</span>
                <span className="font-normal">{categoryDisplayName(category)}</span>
              </div>
              <div className="flex w-full flex-col items-start font-normal lg:flex-row lg:items-center lg:justify-between">
                <div>
                  舉報時間：<span className="text-nowrap">{formatDateTimeText(createdAt)}</span>
                </div>
                <div>
                  更新時間：<span className="text-nowrap">{formatDateTimeText(updatedAt)}</span>
                </div>
                <div>
                  案件識別碼：<span className="text-nowrap">{_id}</span>
                </div>
              </div>
            </div>
            <div className="card-body flex-col border-b border-base-content/25 text-base lg:flex-row">
              <div className="lg:w-5/12">
                <p className="mb-1 text-xl">違規名單</p>
                <ul className="break-all">
                  {violators.map((violator) => (
                    <li key={violator.violatorId}>
                      <Violator {...violator} round={round} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-7/12">
                <p className="mb-1 text-xl">案件描述</p>
                {descriptionDigest}
                {descriptionOmittedLength > 0 && <em>(…下略 {descriptionOmittedLength} 字)</em>}
              </div>
            </div>
            <div className="card-actions justify-end bg-base-200 p-4">
              <a
                className="btn btn-primary hover:no-underline"
                href={getViolationCaseUrl(round, _id)}
              >
                詳細內容
              </a>
            </div>
          </div>
        )}
      />
    </>
  )
}
