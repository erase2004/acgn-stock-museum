import { companyProductTotal } from '@/stores/account'
import { currencyFormat } from '@/utils/helpers'
import { useUser } from '@/utils/hooks'
import { useStore } from '@nanostores/preact'

type Props = {
  companyId: string
  capital: number
}

export default function UserProductQuotaInfo({ companyId, capital }: Props) {
  const { user } = useUser()
  const $companyProductTotal = useStore(companyProductTotal)

  if (!user) return <></>

  const currentUserSpentTradeQuota = $companyProductTotal[companyId] ?? 0
  const currentUserAvailableTradeQuota = Math.ceil(capital * 0.1) - currentUserSpentTradeQuota

  return (
    <div class="flex flex-wrap text-nowrap">
      <span>你的購買額度：</span>
      <div class="flex gap-x-2">
        <span>已用 ${currencyFormat(currentUserSpentTradeQuota)}</span>
        <span>/</span>
        <span>剩餘 ${currencyFormat(currentUserAvailableTradeQuota)}</span>
      </div>
    </div>
  )
}
