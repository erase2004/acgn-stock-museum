import { theme } from '@/stores/common'
import { useStore } from '@nanostores/preact'

/** call fn after theme changed */
export function useThemeChanged(fn: (...value: any) => void) {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const $theme = useStore(theme)
  fn()
}
