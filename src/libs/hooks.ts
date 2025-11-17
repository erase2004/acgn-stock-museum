import { theme } from '@/stores/common'
import { useStore } from '@nanostores/react'

/** call fn after theme changed */
export function useThemeChanged(fn: (...value: any) => void) {
  const _$theme = useStore(theme)
  fn()
}
