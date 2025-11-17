import type { ValidateType } from '@/services/dbUsers'
import type { Chart } from 'chart.js'
import xss from 'xss'
import showdown from 'showdown'
// @ts-expect-error: no type definition for showdown-footnotes
import footnotes from 'showdown-footnotes'
import katex from 'katex'
import { ZodError } from 'astro/zod'
import removeMd from 'remove-markdown'
import { last } from 'lodash-es'
import { rounds } from '@/configs/sites'

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

function simpleValidateTypeText(validateType: ValidateType) {
  switch (validateType) {
    case 'PTT':
      return 'PTT'
    case 'Bahamut':
      return '巴哈'
    case 'Google':
      return 'G帳'
  }
}

export function styledValidateTypeMarkHtml(validateType: ValidateType) {
  return `<span class="text-[60%] align-top">⟨${simpleValidateTypeText(validateType)}⟩</span>`
}

export function interleave<T, S>(arr: T[], value: S): (T | S)[] {
  const length = arr.length
  return arr.flatMap((v, i) => (i + 1 !== length ? [v, value] : v))
}

export async function handlePromiseParser<T, U extends Promise<T>>(
  parseFn: U,
  slient: boolean = false,
) {
  try {
    const result = await parseFn
    return result
  } catch (err) {
    if (err instanceof ZodError && !slient) {
      console.error(err.errors)
    }
    return undefined
  }
}

export function setChartStyle(chart: typeof Chart) {
  const style = window.getComputedStyle(document.body)
  chart.defaults.color = style.getPropertyValue('--color-base-content')
  chart.defaults.borderColor = style.getPropertyValue('--color-graph-axis')
}

function escapeHtml(html: any) {
  return html
}

const xssFilter = {
  type: 'output',
  filter: function (text: any) {
    return xss(text, {
      escapeHtml,
      whiteList: {
        span: ['class', 'style'],
      },
      css: {
        whiteList: {
          'aria-hidden': true,
          'vertical-align': true,
          top: true,
          position: true,
          height: true,
        },
      },
    })
  },
}

const codeTagEscapedCharacterTranser = {
  type: 'lang',
  filter: function (text: string) {
    const output = text.replace(/```((.|\r|\n)*?)```/g, function (_, capture) {
      const text = capture
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/&excl;/g, '!')

      return `\`\`\`${text}\`\`\``
    })

    return output
  },
}

const katexExtension = {
  type: 'lang',
  filter: function (text: string) {
    // lang模式會將$轉換為¨D      \r\n轉換為 \n
    const outputKatexHTML = text.replace(/¨D¨D((.|\n)*?)¨D¨D/g, function (_, capture) {
      const text = capture
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&quot;/g, '"')
        .replace(/\n/g, '\r\n')
      let html = katex.renderToString(text)

      if (text.search('\n') !== -1) {
        html = `<br/>${html}`
      }

      return html
    })

    return outputKatexHTML
  },
}

export function markdownToHtml(content: string, advanced = false) {
  if (!content) {
    return ''
  }

  const extensions = [xssFilter, footnotes, codeTagEscapedCharacterTranser]
  let processedContent = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
  if (advanced) {
    // 保留 KaTeX 和圖片
    extensions.push(katexExtension)
  } else {
    processedContent = processedContent.replace(/!/g, '&excl;')
  }

  const converter = new showdown.Converter({ extensions })
  converter.setFlavor('github')
  converter.setOption('openLinksInNewWindow', true)

  return converter.makeHtml(processedContent)
}

export function removeMarkdown(text: string) {
  return removeMd(text).replace(/"/g, `''`)
}

export function typedObjectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as [keyof typeof obj]
}

function escapeRegExp(str: string) {
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function buildSearchRegExp(keyword: string, matchType: 'exact' | 'fuzzy') {
  if (matchType === 'exact') {
    // 直接照原樣比對關鍵字
    return new RegExp(escapeRegExp(keyword), 'i')
  }

  // 將關鍵字拆成一個一個字，比對中間插入任何字元的狀況
  const patternString = keyword.split('').map(escapeRegExp).join('.*')
  return new RegExp(patternString, 'i')
}

export function roundToDecimalPlaces(number: number, digit: number) {
  const p = Math.pow(10, digit)
  return Math.round(number * p) / p
}

export function formatDescription(text: string) {
  const maxLength = 200

  if (text.length > maxLength) {
    return `${text.slice(0, maxLength - 5)}...`
  }

  return text
}

export function isLatestRound(round: string) {
  return last(rounds) === round
}

export function decimalToPercentage(n: number) {
  return Math.round(n * 100)
}

export function isGreaterThanMd(windowWidth: number) {
  return windowWidth >= 768
}

export function isGreaterThanLg(windowWidth: number) {
  return windowWidth >= 1024
}

export function isGreaterThanXl(windowWidth: number) {
  return windowWidth >= 1200
}
