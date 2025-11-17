import CompanyLink from '@/components/common/preact/CompanyLink'
import UserLink from '@/components/common/preact/UserLink'
import type { BasicUser } from '@/services/dbUsers'
import { fallbackImageUrl } from '@/configs/general'
import { formatDateTimeText } from '@/libs/timeFormat'
import { ownStocks } from '@/stores/account'
import { listViewMode, items, type ListItem } from '@/stores/company'
import { currencyFormat } from '@/utils/helpers'
import { useUser } from '@/utils/hooks'
import { useStore } from '@nanostores/react'
import { priceDisplayClass, getStockPercentage } from '@/utils/company'
import { totalAmount } from '@/stores/pagination'

type Props = {
  round: string
  storeKey: string
}

export default function ListContainer({ round, storeKey }: Props) {
  const { user } = useUser()
  const $listViewMode = useStore(listViewMode)
  const $items = useStore(items)
  const $ownStocks = useStore(ownStocks)
  const $totalAmount = useStore(totalAmount)

  if ($listViewMode === 'card') {
    return (
      <div className="grid grid-cols-1 justify-items-center gap-y-6 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
        <p className="col-span-full">總共{$totalAmount[storeKey]}家公司</p>
        {$items.map((item) => (
          <Card key={item._id} round={round} item={item} user={user} ownStocks={$ownStocks} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-6">
      <p>總共{$totalAmount[storeKey]}家公司</p>
      {$items.map((item) => (
        <Row key={item._id} round={round} item={item} user={user} ownStocks={$ownStocks} />
      ))}
    </div>
  )
}

type User = BasicUser | null

type CardProps = {
  round: string
  item: ListItem
  user: User
  ownStocks: Record<string, number>
}

function Card({ round, item, user, ownStocks }: CardProps) {
  return (
    <div className="w-full max-w-80 px-4">
      <div
        className={`company-card card border border-base-content/25 shadow-lg/50 ${cardDisplayClass(item, user, ownStocks)}`}
      >
        <div className="flex items-center justify-between border-b border-inherit px-2">
          <small>{formatDateTimeText(item.createdAt)} 創立</small>
          {user && (
            <>
              {isFavorite(item._id, user) ? (
                <i className="fa fa-heart text-secondary" aria-hidden="true"></i>
              ) : (
                <i className="fa fa-heart-o text-secondary" aria-hidden="true"></i>
              )}
            </>
          )}
        </div>
        {item.illegalReason && (
          <div className="truncate border-b border-inherit text-center text-error">
            <i className="fa fa-warning"></i>
            {item.illegalReason}
          </div>
        )}
        <div className="flex justify-around py-1">
          <div className="flex flex-col self-center">
            <img
              className="size-40 object-cover"
              src={item.pictureSmall || fallbackImageUrl}
              alt={`${item.companyName}公司的小圖`}
              decoding={'async'}
            />
          </div>
        </div>
        <div className="title truncate text-center text-2xl text-neutral-content *:mx-1.5 *:text-inherit">
          <CompanyLink round={round} companyId={item._id} />
        </div>
        <div className="flex flex-col border-b border-inherit px-4">
          <div>
            <p>{item.chairmanTitle}</p>
            <p className="truncate text-right text-2xl">
              <UserLink round={round} userId={item.chairman} />
            </p>
          </div>
          <div>
            <p>經理人</p>
            <p className="truncate text-right text-2xl">
              <UserLink round={round} userId={item.manager} />
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-0.5 px-4 py-2 *:flex *:flex-wrap *:justify-between *:gap-x-1 *:text-nowrap">
          <div>
            <p>股票價格</p>
            <p className={priceDisplayClass(item)}>
              $ {currencyFormat(item.lastPrice)}({currencyFormat(item.listPrice)})
            </p>
          </div>
          <div>
            <p>資本額</p>
            <p>$ {currencyFormat(item.capital)}</p>
          </div>
          <div>
            <p>總市值</p>
            <p>$ {currencyFormat(item.totalValue)}</p>
          </div>
          <div>
            <p>總釋股量</p>
            <p>{item.totalRelease}</p>
          </div>
          <div>
            <p>每股盈餘</p>
            <p>{currencyFormat(item.eps)}</p>
          </div>
          {user && (
            <div>
              <p>持有股份</p>
              <p>
                {getStockAmount(item, ownStocks)} (
                {getStockPercentage(getStockAmount(item, ownStocks), item.totalRelease)}%)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function cardDisplayClass(company: ListItem, user: User, ownStocks: Record<string, number>) {
  if (!user) return 'company-card-default'

  const userId = user._id

  if (company.chairman === userId) return 'company-card-chairman'

  if (company.manager === userId) return 'company-card-manager'

  if (company.founder === userId) return 'company-card-founder'

  if (company._id in ownStocks) return 'company-card-holder'

  return 'company-card-default'
}

function isFavorite(companyId: string, user: User) {
  if (!user || !user.favorite) return false

  return user.favorite.includes(companyId)
}

function getStockAmount(item: ListItem, ownStocks: Record<string, number>) {
  return ownStocks[item._id] || 0
}

type RowProps = {
  round: string
  item: ListItem
  user: User
  ownStocks: Record<string, number>
}
function Row({ round, item, user, ownStocks }: RowProps) {
  return (
    <div className="flex flex-col md:flex-row">
      <img
        className="size-28 shrink-0 object-cover"
        src={item.pictureSmall || fallbackImageUrl}
        alt={`${item.companyName}公司的小圖`}
        decoding={'async'}
      />

      <div className="company-row grid grow grid-cols-3 border border-base-content/25 *:px-1 lg:grid-cols-4">
        {item.illegalReason && (
          <p className="col-span-full truncate text-center text-error">
            <i className="fa fa-warning"></i>
            本公司已被標記為違規！原因：{item.illegalReason}
          </p>
        )}
        <p className="title">角色名稱</p>
        <div className="content text-left lg:col-span-3">
          <CompanyLink round={round} companyId={item._id} />
        </div>

        <p className="title">創立日期</p>
        <div className="content">{formatDateTimeText(item.createdAt)}</div>

        <p className="title">{item.chairmanTitle}</p>
        <div className="content text-left">
          <UserLink round={round} userId={item.chairman} />
        </div>

        <p className="title">經理人</p>
        <div className="content text-left">
          <UserLink round={round} userId={item.manager} />
        </div>

        <p className="title">股票價格</p>
        <div className="content">
          <span className={priceDisplayClass(item)}>
            $ {currencyFormat(item.lastPrice)}({currencyFormat(item.listPrice)})
          </span>
        </div>

        <p className="title">資本額</p>
        <div className="content">$ {currencyFormat(item.capital)}</div>

        <p className="title">總市值</p>
        <div className="content">$ {currencyFormat(item.totalValue)}</div>

        <p className="title">總釋股量</p>
        <div className="content">{item.totalRelease}</div>

        <p className="title">每股盈餘</p>
        <div className="content">{currencyFormat(item.eps)}</div>

        {user && (
          <div className="col-span-full">
            <p>
              {isFavorite(item._id, user) ? '您已將此公司加入最愛。' : '您未將此公司加入最愛。'}
            </p>
            <p>
              您在該公司持有{getStockAmount(item, ownStocks)}數量的股份，股權比例為
              {getStockPercentage(getStockAmount(item, ownStocks), item.totalRelease)}%。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
