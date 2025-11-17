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
    <div className="flex items-center justify-between text-center">
      {previousSeasonUrl ? (
        <a href={previousSeasonUrl}>
          <span className={buttonClasses}>&laquo;</span>
        </a>
      ) : (
        <span className={`${buttonClasses} btn-disabled`}>&laquo;</span>
      )}
      <div>
        <span className="inline-block text-nowrap">
          {formatDateTimeText(currentSeason.beginDate)}～
        </span>
        <span className="inline-block text-nowrap">
          {formatDateTimeText(currentSeason.endDate)}
        </span>
      </div>
      {nextSeasonUrl ? (
        <a href={nextSeasonUrl}>
          <span className={buttonClasses}>&raquo;</span>
        </a>
      ) : (
        <span className={`${buttonClasses} btn-disabled`}>&raquo;</span>
      )}
    </div>
  )
}
