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
    <div>
      <p className="mb-2 text-xl">選舉下個商業季度的負責經理人：</p>
      <div className="company-panel-table max-h-72 *:px-4">
        <div className="sticky-control header">
          <div className="col-span-4">候選人</div>
          <div className="col-span-1">支持率</div>
          <div className="col-span-7">支持者</div>
        </div>
        {displayItems.map((item) => (
          <div key={item.id} className="grid grid-cols-12">
            <p className="col-span-3 md:hidden">候選人</p>
            <div className="col-span-9 truncate md:col-span-4">
              <UserLink round={round} userId={item.id} />
            </div>
            <p className="col-span-3 md:hidden">支持率</p>
            <div className="col-span-9 text-right md:col-span-1 md:text-center">
              {getStockPercentage(item.votes, totalRelease)}%
            </div>
            <p className="col-span-3 md:hidden">支持者</p>
            <div className="col-span-9 md:col-span-7">
              {item.list.length > 0 ? (
                <div className="collapse">
                  <input type="checkbox" className="peer" />
                  <button className="btn collapse-title flex w-20 justify-center justify-self-center p-4 btn-sm btn-primary">
                    清單 <i className="fa fa-users" aria-hidden="true"></i>
                  </button>
                  <div className="collapse-content mt-1 bg-base-200 peer-checked:p-2">
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
