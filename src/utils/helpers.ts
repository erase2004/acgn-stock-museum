import type { VALIDATE_TYPE } from '@/services/dbUserArchive'
import type { Chart } from 'chart.js'

export function currencyFormat(money: any, formatOption: Intl.NumberFormatOptions = {}) {
  switch (typeof money) {
    case 'string':
      return parseFloat(money).toLocaleString('en-US', formatOption)
    case 'number':
      return money.toLocaleString('en-US', formatOption)
    default:
      return money
  }
}

export function toCurrencyAbbr(value: number) {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function simpleValidateTypeText(validateType: VALIDATE_TYPE) {
  switch (validateType) {
    case 'PTT':
      return 'PTT'
    case 'Bahamut':
      return '巴哈'
    case 'Google':
      return 'G帳'
  }
}

export function styledValidateTypeMarkHtml(validateType: VALIDATE_TYPE) {
  return `<span class="text-xs align-top">⟨${simpleValidateTypeText(validateType)}⟩</span>`
}

// TODO: sync with dbCompanyStones
export function stoneDisplayName(stoneType: string) {
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

export function interleave<T, S>(arr: T[], value: S): (T | S)[] {
  const length = arr.length
  return arr.flatMap((v, i) => (i + 1 !== length ? [v, value] : v))
}

export async function handlePromiseParser<T, U extends Promise<T>>(parseFn: U) {
  try {
    return await parseFn
  } catch {
    return undefined
  }
}

export function setChartStyle(chart: typeof Chart) {
  const style = window.getComputedStyle(document.body)
  chart.defaults.color = style.getPropertyValue('--color-base-content')
  chart.defaults.borderColor = style.getPropertyValue('--color-graph-axis')
}
