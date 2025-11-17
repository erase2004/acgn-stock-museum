import type { z } from 'astro/zod'
import type { User } from '@/services/dbUsers'
import CompanyLink from '@/components/common/preact/CompanyLink'
import LoadMore from '@/components/common/preact/LoadMore'
import {
  stonePowerTable,
  stoneTypeList,
  type schema as schemaCompanyStone,
} from '@/services/dbCompanyStones'
import { useDisplayItems } from '@/utils/hooks'
import { getStoneIcon, stoneDisplayName } from '@/utils/stone'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'

type Props = {
  round: string
  profile: User['profile']
  data: z.infer<typeof schemaCompanyStone>[]
}

const STORE_KEY = dataStoreKey.account.stone
const PAGE_SIZE = dataNumberPerPage.account.stone

export default function StoneList({ round, profile, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <>
      <div className="mb-2">
        <p className="mb-1">帳號擁有石頭</p>
        <div className="flex flex-col flex-wrap justify-around md:flex-row">
          {stoneTypeList.map((type) => (
            <div key={type} className="text-nowrap">
              <img
                className="inline-block size-8"
                src={getStoneIcon(type)}
                alt={stoneDisplayName(type)}
              />
              {stoneDisplayName(type)} {profile['stones'][type] || 0} 個
              <small className="align-text-top">(生產值 {stonePowerTable[type]}／個)</small>
            </div>
          ))}
        </div>
      </div>
      <p className="mb-1">已放置的石頭</p>
      <div className="overflow-y-auto">
        <table className="table-base table-pin-rows custom-responsive-table-md table">
          <thead>
            <tr className="*:px-1">
              <th className="text-center text-nowrap">公司名稱</th>
              <th className="w-24 text-center text-nowrap">石頭類型</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <tr className="*:px-1" key={item.companyId}>
                  <td className="truncate text-left text-nowrap" data-title="公司名稱">
                    <CompanyLink round={round} companyId={item.companyId} />
                  </td>
                  <td className="truncate text-center text-nowrap" data-title="石頭類型">
                    {stoneDisplayName(item.stoneType)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="default-content">
                <td className="truncate" colSpan={2}>
                  查無資料！
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <LoadMore storeKey={STORE_KEY} />
      </div>
    </>
  )
}
