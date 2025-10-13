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
