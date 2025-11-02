import type { StoneType } from '@/services/dbCompanyStones'

import IconBirth from '@/assets/icons/stones/birth.png'
import IconQeust from '@/assets/icons/stones/quest.png'
import IconRainbow from '@/assets/icons/stones/rainbow.png'
import IconRainbowFragment from '@/assets/icons/stones/rainbow-fragment.png'
import IconSaint from '@/assets/icons/stones/saint.png'

export function getStoneIcon(stoneType: StoneType) {
  switch (stoneType) {
    case 'birth':
      return IconBirth.src
    case 'quest':
      return IconQeust.src
    case 'rainbow':
      return IconRainbow.src
    case 'rainbowFragment':
      return IconRainbowFragment.src
    case 'saint':
      return IconSaint.src
    default: {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const unreachable: never = stoneType
      return undefined
    }
  }
}

export function stoneDisplayName(stoneType: StoneType) {
  switch (stoneType) {
    case 'saint':
      return '聖晶石'
    case 'birth':
      return '誕生石'
    case 'rainbow':
      return '彩虹石'
    case 'rainbowFragment':
      return '彩虹石碎片'
    case 'quest':
      return '任務石'
    default:
      return `未知的石頭(${stoneType})`
  }
}
