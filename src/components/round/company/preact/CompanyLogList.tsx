import type { schema } from '@/services/dbLog'
import type { z } from 'astro/zod'
import DisplayLog from '@/components/common/preact/DisplayLog'
import LoadMore from '@/components/common/preact/LoadMore'
import { useState, useEffect } from 'react'
import { useFilter, useUser } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { intersection, isArray, isString } from 'lodash-es'
import { useStore } from '@nanostores/react'
import { totalAmount } from '@/stores/pagination'

const STORE_KEY = dataStoreKey.company.log
const PAGE_SIZE = dataNumberPerPage.company.log

type Log = z.infer<typeof schema>
type Props = {
  round: string
  data: Log[]
}

export default function CompanyLogList({ round, data }: Props) {
  const [filterOn, setFilterOn] = useState(false)
  const { user } = useUser()

  const $totalAmount = useStore(totalAmount)
  const { filteredItems, setFilterValue } = useFilter(
    STORE_KEY,
    PAGE_SIZE,
    data,
    {
      filterFn(item, filters) {
        {
          // userId
          const key = 'userId'
          const target = filters[key]
          const value = item[key]

          if (!isArray(value)) return false

          if (isArray(target)) {
            const inter = intersection(value, target)
            return inter.length > 0
          }

          if (isString(target)) return value.includes(target)

          return true
        }
      },
    },
    false,
  )

  useEffect(() => {
    if (!user) {
      setFilterOn(false)
    }
  }, [user])

  function toggleFilter() {
    if (filterOn) {
      setFilterValue('userId', undefined)
      setFilterOn(false)
    } else {
      setFilterValue('userId', [user!._id, '!all'])
      setFilterOn(true)
    }
  }

  return (
    <div>
      {user && (
        <button className="btn mb-1 btn-outline btn-sm btn-info" onClick={toggleFilter}>
          {filterOn ? '只檢視自身紀錄' : '檢視所有紀錄'}
        </button>
      )}
      <p>總共{$totalAmount[STORE_KEY]}筆紀錄</p>
      {filteredItems.length > 0 ? (
        <>
          {filteredItems.map((item) => (
            <p key={item._id}>
              <DisplayLog {...item} round={round} />
            </p>
          ))}
          <LoadMore storeKey={STORE_KEY} />
        </>
      ) : (
        '查無資料'
      )}
    </div>
  )
}
