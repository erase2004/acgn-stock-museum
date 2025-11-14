import type { z } from 'astro/zod'
import { arenaMaximumRound } from '@/configs/general'
import { getAttributeNumber, type schema } from '@/services/dbArenaFighters'
import { useUser } from '@/utils/hooks'
import CompanyLink from '@/components/common/preact/CompanyLink'
import { FIRST_ROUND } from '@/configs/sites'

type Fighter = z.infer<typeof schema>
type Props = {
  round: string
  manager: string
  fighter: Fighter
  attackSequnce: string[]
}

export default function ArenaStrategyForm({ round, manager, fighter, attackSequnce }: Props) {
  const { user } = useUser()
  const isFirstRound = round === FIRST_ROUND

  if (user?._id !== manager) return <></>

  return (
    <>
      <div class="divider my-2"></div>
      <div class="flex flex-col gap-y-4">
        <p class="text-xl">這一屆大賽的策略：</p>
        <div>
          <p class="text-nowrap">
            設定的特攻消耗數值(1~10)：<span class="bg-base-300 px-4 py-1">{fighter['spCost']}</span>
          </p>
          <p class="text-warning">特攻消耗數值越高越容易使出特殊攻擊，但也會越快耗盡SP。</p>
          <p class="text-info">{spForecast(fighter, isFirstRound)}</p>
        </div>
        <div class="flex flex-col max-lg:gap-y-1 lg:flex-row lg:gap-x-8">
          <div class="flex w-full flex-col gap-y-1 overflow-x-hidden lg:w-1/2">
            <p>設定的普通攻擊招式名：</p>
            {fighter['normalManner'].map((manner, index) => (
              <p key={index} class="overflow-x-auto bg-base-300 px-4 py-1 text-nowrap">
                {manner}
              </p>
            ))}
          </div>
          <div class="flex w-full flex-col gap-y-1 overflow-x-hidden lg:w-1/2">
            <p>設定的特殊攻擊招式名：</p>
            {fighter['specialManner'].map((manner, index) => (
              <p key={index} class="overflow-x-auto bg-base-300 px-4 py-1 text-nowrap">
                {manner}
              </p>
            ))}
          </div>
        </div>
        <div class="flex w-full flex-col gap-y-1 lg:w-1/2">
          <p>設定的優先攻擊順序：</p>
          <div class="max-h-60 overflow-y-auto border border-base-content/25 bg-base-300 p-2">
            <div class="flex flex-col gap-y-1">
              {attackSequnce.map((companyId) => (
                <p key={companyId} class="truncate border-base-content/25 not-last:border-b">
                  <CompanyLink round={round} companyId={companyId} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function spForecast(fighter: Fighter, isFirstRound: boolean) {
  const sp = getAttributeNumber('sp', fighter['sp'], isFirstRound)
  const spCost = fighter['spCost']
  const tenRoundForecast = Math.floor(Math.min((sp + 1) / spCost, spCost))
  const maximumForecast = Math.floor(
    Math.min((sp + Math.floor(arenaMaximumRound / 10)) / spCost, (spCost / 10) * arenaMaximumRound),
  )

  return `目前的SP量為 ${sp}
      ，在 10 回合的戰鬥中估計可以發出 ${tenRoundForecast} 次特殊攻擊，
      在 ${arenaMaximumRound} 回合的戰鬥中估計可以發出 ${maximumForecast} 次特殊攻擊。`
}
