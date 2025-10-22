import type { z } from 'astro/zod'
import { announcementCategoryMap, schema } from '@/services/dbAnnouncements'

type Announcement = z.infer<typeof schema>

export function categoryDisplayName(category: string) {
  return (
    announcementCategoryMap[category as keyof typeof announcementCategoryMap] || {
      displayName: `未知分類(${category})`,
    }
  ).displayName
}

export function isVoided(announcement: Pick<Announcement, 'voided'>) {
  return announcement.voided
}

export function computeThreshold(thresholdPercent: number, activeUserCount: number) {
  return Math.ceil((activeUserCount * thresholdPercent) / 100)
}
