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
