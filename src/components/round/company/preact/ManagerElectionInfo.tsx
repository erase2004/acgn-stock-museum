import LoadMore from '@/components/common/preact/LoadMore'
import UserLink from '@/components/common/preact/UserLink'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { getStockPercentage } from '@/utils/company'
import { interleave } from '@/utils/helpers'
import { useDisplayItems } from '@/utils/hooks'

const PAGE_SIZE = dataNumberPerPage.company.manager
const STORE_KEY = dataStoreKey.company.manager

type Candidate = {
  id: string
  votes: number
  list: string[]
}

type Props = {
  round: string
  totalRelease: number
  data: Candidate[]
}

export default function ManagerElectionInfo({ round, totalRelease, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <div class="pb-2 *:px-4">
      <p class="mb-2 text-xl">選舉下個商業季度的負責經理人：</p>
      <div class="max-h-72 overflow-y-auto border-base-content/25 *:border-dashed *:border-inherit max-md:*:not-last:border-b">
        <div class="sticky-control hidden grid-cols-12 text-center text-nowrap md:grid">
          <div class="col-span-4">候選人</div>
          <div class="col-span-2">支持率</div>
          <div class="col-span-6">支持者</div>
        </div>
        {displayItems.map((item) => (
          <div key={item.id} class="grid grid-cols-12">
            <p class="col-span-3 md:hidden">候選人</p>
            <div class="col-span-9 truncate md:col-span-4">
              <UserLink round={round} userId={item.id} />
            </div>
            <p class="col-span-3 md:hidden">支持率</p>
            <div class="col-span-9 text-right md:col-span-2 md:text-center">
              {getStockPercentage(item.votes, totalRelease)}%
            </div>
            <p class="col-span-3 md:hidden">支持者</p>
            <div class="col-span-9 md:col-span-6">
              {item.list.length > 0 ? (
                <div class="collapse">
                  <input type="checkbox" class="peer" />
                  <button class="btn collapse-title flex w-20 justify-center justify-self-center p-4 btn-sm btn-primary">
                    清單 <i class="fa fa-users" aria-hidden="true"></i>
                  </button>
                  <div class="collapse-content mt-1 bg-base-200 peer-checked:p-2">
                    {interleave(
                      item.list.map((directorId) => (
                        <UserLink key={directorId} round={round} userId={directorId} />
                      )),
                      '、',
                    )}
                  </div>
                </div>
              ) : (
                '無'
              )}
            </div>
          </div>
        ))}
        <LoadMore storeKey={STORE_KEY} />
      </div>
    </div>
  )
}
