import type { schema } from '@/services/dbLog'
import type { z } from 'astro/zod'
import DisplayLog from '@/components/common/preact/DisplayLog'
import LoadMore from '@/components/common/preact/LoadMore'
import { useState, useEffect } from 'preact/hooks'
import { useFilter, useUser, type FilterConfig } from '@/utils/hooks'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { intersection, isArray } from 'lodash-es'

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

  const { filteredItems, setFilterValue } = useFilter(
    STORE_KEY,
    PAGE_SIZE,
    data,
    {
      userId: {
        isEqualFn: (field, target) => {
          if (!isArray(field)) return false

          if (!isArray(target)) return field.includes(target)

          const inter = intersection(field, target)
          return inter.length > 0
        },
      } satisfies FilterConfig<Log, 'userId'>,
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
      setFilterValue('userId', [])
      setFilterOn(false)
    } else {
      setFilterValue('userId', [user!._id, '!all'])
      setFilterOn(true)
    }
  }

  return (
    <>
      {user && (
        <button class="btn mb-1 btn-outline btn-sm btn-info" onClick={toggleFilter}>
          {filterOn ? '只檢視自身紀錄' : '檢視所有紀錄'}
        </button>
      )}
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
    </>
  )
}
