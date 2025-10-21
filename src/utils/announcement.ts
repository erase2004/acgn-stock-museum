import { announcementCategoryMap } from '@/services/dbAnnouncements'

export function categoryDisplayName(category: string) {
  return (
    announcementCategoryMap[category as keyof typeof announcementCategoryMap] || {
      displayName: `未知分類(${category})`,
    }
  ).displayName
}
