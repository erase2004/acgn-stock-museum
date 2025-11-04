import type { z } from 'astro/zod'
import type { schema as schemaAnnouncement } from '@/services/dbAnnouncements'
import { isVoided } from '@/utils/announcement'
import { formatDateTimeText } from '@/libs/timeFormat'

type Props = z.infer<typeof schemaAnnouncement>

export default function PetitionState(announcement: Props) {
  const { rejectionPetition: petition } = announcement

  return isVoided(announcement) ? (
    <>
      <span class="text-nowrap text-warning">
        <i class="fa fa-warning"></i> 公告已作廢，連署中止
      </span>
    </>
  ) : petition!.passedAt ? (
    <span class="text-nowrap text-success">
      <i class="fa fa-check"></i> 連署已通過（於 {formatDateTimeText(petition!.passedAt)}）
    </span>
  ) : (
    <span class="text-nowrap text-error">
      <i class="fa fa-times"></i> 已截止，連署未通過
    </span>
  )
}
