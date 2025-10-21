import { actionMap } from '@/services/dbViolationCaseActionLogs'
import { stateMap, categoryMap } from '@/services/dbViolationCases'

export function stateDisplayName(state: string) {
  return (stateMap[state as keyof typeof stateMap] || { displayName: `未知(${state})` }).displayName
}

export function categoryDisplayName(category: string) {
  return (categoryMap[category as keyof typeof categoryMap] || { displayName: `未知(${category})` })
    .displayName
}

export function stateBadgeClass(state: string) {
  switch (state) {
    case 'pending':
      return 'badge-default'
    case 'processing':
      return 'badge-info'
    case 'rejected':
      return 'badge-error'
    case 'closed':
      return 'badge-warning'
    default:
      return 'badge-default'
  }
}

export function actionDisplayName(action: string) {
  return (actionMap[action as keyof typeof actionMap] || { displayName: `未知(${action})` })
    .displayName
}
