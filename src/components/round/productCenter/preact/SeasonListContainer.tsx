import type { schema as schemaProduct } from '@/services/dbProducts'
import type { z } from 'astro/zod'
import CompanyLink from '@/components/common/preact/CompanyLink'
import ProductLink from '@/components/common/preact/ProductLink'
import LoadMore from '@/components/common/preact/LoadMore'
import { isRestrictedRating, useProductCenter } from '@/utils/product'
import { dataNumberPerPage, dataStoreKey } from '@/configs/general'
import { FIRST_ROUND } from '@/configs/sites'
import { useStore } from '@nanostores/react'
import { totalAmount } from '@/stores/pagination'

const STORE_KEY = dataStoreKey.productCenter.season
const PAGE_SIZE = dataNumberPerPage.productCenter.season

type Props = {
  round: string
  data: z.infer<typeof schemaProduct>[]
}

export default function SeasonListContainer({ round, data }: Props) {
  const isFirstRound = round === FIRST_ROUND

  const $totalAmount = useStore(totalAmount)
  const { displayItems, handleSortChange, getSortButtonClass, getSortIcon } = useProductCenter(
    data,
    PAGE_SIZE,
    STORE_KEY,
  )

  return (
    <>
      <p>總共{$totalAmount[STORE_KEY]}項產品</p>
      <div className="sticky-control mb-2 flex gap-x-2 py-4 md:hidden">
        <button
          className={`btn-default btn btn-outline btn-sm ${getSortButtonClass('type')}`}
          onClick={() => {
            handleSortChange('type')
          }}
        >
          類別
          {getSortIcon('type')}
        </button>
        <button
          className={`btn-default btn btn-outline btn-sm ${getSortButtonClass('rating')}`}
          onClick={() => {
            handleSortChange('rating')
          }}
        >
          分級
          {getSortIcon('rating')}
        </button>
        <button
          className={`btn-default btn btn-outline btn-sm ${getSortButtonClass('voteCount')}`}
          onClick={() => {
            handleSortChange('voteCount')
          }}
        >
          得票數
          {getSortIcon('voteCount')}
        </button>
      </div>
      <table className="table-base custom-responsive-table-md table-pin-rows table">
        <thead>
          <tr className="*:px-0">
            <th className="text-center">產品</th>
            <th className="w-1/5 text-center">公司名稱</th>
            <th
              className="w-24 cursor-pointer text-center"
              onClick={() => {
                handleSortChange('type')
              }}
            >
              類別
              {getSortIcon('type')}
            </th>
            <th
              className="w-24 cursor-pointer text-center"
              onClick={() => {
                handleSortChange('rating')
              }}
            >
              分級
              {getSortIcon('rating')}
            </th>
            <th
              className="w-24 cursor-pointer text-center"
              onClick={() => {
                handleSortChange('voteCount')
              }}
            >
              得票數
              {getSortIcon('voteCount')}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayItems.length > 0 ? (
            displayItems.map((item) => (
              <tr key={item._id}>
                <td className="text-left" data-title="產品">
                  <div className="max-h-12 overflow-y-auto break-all">
                    <ProductLink productId={item._id} />
                  </div>
                  <div className="max-h-14 overflow-y-auto text-sm break-all">
                    {item.description}
                  </div>
                </td>
                <td className="text-left text-wrap" data-title="公司名稱">
                  <CompanyLink round={round} companyId={item.companyId} />
                </td>
                <td className="text-center text-nowrap" data-title="類別">
                  {item.type}
                </td>
                {isRestrictedRating(item.rating) ? (
                  <td
                    className="text-center text-nowrap text-error before:text-base-content"
                    data-title="分級"
                  >
                    {item.rating}
                  </td>
                ) : (
                  <td className="text-center text-nowrap" data-title="分級">
                    &nbsp;
                  </td>
                )}

                <td className="text-center text-nowrap" data-title="得票數">
                  <span className="badge items-baseline badge-soft text-base badge-info">
                    {item.voteCount}
                    {isFirstRound ? (
                      <i className="fa fa-money" aria-hidden="true"></i>
                    ) : (
                      <i className="fa fa-ticket" aria-hidden="true"></i>
                    )}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr className="default-content">
              <td colSpan={5}>當季度沒有任何產品上架！</td>
            </tr>
          )}
        </tbody>
      </table>
      <LoadMore storeKey={STORE_KEY} />
    </>
  )
}
