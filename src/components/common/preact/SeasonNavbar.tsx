import { formatDateTimeText } from '@/libs/timeFormat'
import type { schema as schemaSeason } from '@/services/dbSeason'
import type { z } from 'astro/zod'

type Season = Pick<z.infer<typeof schemaSeason>, 'beginDate' | 'endDate'>

type Props = {
  buttonClasses?: string
  previousSeasonUrl?: string
  nextSeasonUrl?: string
  currentSeason: Season
}

export default function SeasonNavbar({
  buttonClasses = 'btn btn-sm btn-primary',
  currentSeason,
  previousSeasonUrl,
  nextSeasonUrl,
}: Props) {
  return (
    <div class="flex items-center justify-between text-center">
      {previousSeasonUrl ? (
        <a href={previousSeasonUrl}>
          <span class={buttonClasses}>&laquo;</span>
        </a>
      ) : (
        <span class={`${buttonClasses} btn-disabled`}>&laquo;</span>
      )}
      <div>
        <span class="inline-block text-nowrap">
          {formatDateTimeText(currentSeason.beginDate)}～
        </span>
        <span class="inline-block text-nowrap">{formatDateTimeText(currentSeason.endDate)}</span>
      </div>
      {nextSeasonUrl ? (
        <a href={nextSeasonUrl}>
          <span class={buttonClasses}>&raquo;</span>
        </a>
      ) : (
        <span class={`${buttonClasses} btn-disabled`}>&raquo;</span>
      )}
    </div>
  )
}
