import type { VALIDATE_TYPE } from '@/services/dbUserArchive'

export function currencyFormat(money: unknown) {
  switch (typeof money) {
    case 'string':
      return parseFloat(money).toLocaleString()
    case 'number':
      return money.toLocaleString()
    default:
      return money
  }
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
