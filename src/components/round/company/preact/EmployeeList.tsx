import LoadMore from '@/components/common/preact/LoadMore'
import UserLink from '@/components/common/preact/UserLink'
import { formatDateTimeText } from '@/libs/timeFormat'
import type { schema } from '@/services/dbEmployees'
import { useDisplayItems } from '@/utils/hooks'
import type { z } from 'astro/zod'

type EmployeeType = 'current' | 'next'
type Employee = z.infer<typeof schema>
type Props = {
  type: EmployeeType
  round: string
  storeKey: string
  pageSize: number
  data: Employee[]
}

function typeLabel(type: EmployeeType) {
  return type === 'current' ? '在職員工' : '儲備員工'
}

function thirdColTitle(type: EmployeeType) {
  return type === 'current' ? '留言' : ''
}

function showMessage(type: EmployeeType, message?: string) {
  return type === 'current' ? message || '無' : ''
}

export default function EmployeeList({ type, round, storeKey, pageSize, data }: Props) {
  const displayItems = useDisplayItems(data, storeKey, pageSize)
  const label = typeLabel(type)

  return (
    <div class="-mx-2 border-t border-base-content/25 px-2 md:-mx-4 md:px-4">
      <p class="mb-1 text-xl">{label}</p>
      <div class="company-panel-table max-h-72 px-2 md:px-4">
        <div class="sticky-control header">
          <div class="col-span-2">使用者帳號</div>
          <div class="col-span-3">報名時間</div>
          <div class="col-span-7">{thirdColTitle(type)}</div>
        </div>
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <div key={item.userId} class="grid grid-cols-12">
              <p class="col-span-5 md:hidden">使用者帳號</p>
              <div class="col-span-7 truncate md:col-span-2">
                <UserLink round={round} userId={item.userId} />
              </div>
              <p class="col-span-5 md:hidden">報名時間</p>
              <div class="col-span-7 text-center md:col-span-3">
                {formatDateTimeText(item.registerAt)}
              </div>
              <p class="col-span-5 md:hidden">{thirdColTitle(type)}</p>
              <div class="col-span-7 md:col-span-7">{showMessage(type, item.message)}</div>
            </div>
          ))
        ) : (
          <div class="text-center">沒有{label}！</div>
        )}
        <LoadMore storeKey={storeKey} />
      </div>
    </div>
  )
}
