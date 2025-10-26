import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import LoadMore from '@/components/common/preact/LoadMore'
import {
  stonePowerTable,
  stoneTypeList,
  type schema as schemaCompanyStone,
} from '@/services/dbCompanyStones'
import { schema as schemaUser } from '@/services/dbUsers'
import { useDisplayItems } from '@/utils/hooks'
import { getStoneIcon, stoneDisplayName } from '@/utils/helpers'

type Props = {
  round: string
  profile: z.infer<typeof schemaUser>['profile']
  data: z.infer<typeof schemaCompanyStone>[]
}

const STORE_KEY = 'stone-info'
const PAGE_SIZE = 10

export default function StoneList({ round, profile, data }: Props) {
  const displayItems = useDisplayItems(data, STORE_KEY, PAGE_SIZE)

  return (
    <>
      <div class="mb-2">
        <p class="mb-1">帳號擁有石頭</p>
        <div class="flex flex-col flex-wrap justify-around md:flex-row">
          {stoneTypeList.map((type) => (
            <div key={type} class="text-nowrap">
              <img
                class="inline-block size-8"
                src={getStoneIcon(type)}
                alt={stoneDisplayName(type)}
              />
              {stoneDisplayName(type)} {profile['stones'][type] || 0} 個
              <small class="align-text-top">(生產值 {stonePowerTable[type]}／個)</small>
            </div>
          ))}
        </div>
      </div>
      <p class="mb-1">已放置的石頭</p>
      <div class="overflow-y-auto">
        <table class="table-base table-pin-rows custom-responsive-table-md table">
          <thead>
            <tr class="*:px-1">
              <th class="text-center text-nowrap">公司名稱</th>
              <th class="w-24 text-center text-nowrap">石頭類型</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <tr class="*:px-1" key={item.companyId}>
                  <td class="truncate text-left text-nowrap" data-title="公司名稱">
                    <CompanyLink round={round} companyId={item.companyId} />
                  </td>
                  <td class="truncate text-center text-nowrap" data-title="石頭類型">
                    {stoneDisplayName(item.stoneType)}
                  </td>
                </tr>
              ))
            ) : (
              <tr class="default-content">
                <td class="truncate" colspan={2}>
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
