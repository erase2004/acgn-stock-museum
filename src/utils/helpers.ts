import type { VALIDATE_TYPE } from '@/services/dbUserArchive'
import type { Chart } from 'chart.js'
import xss from 'xss'
import showdown from 'showdown'
// @ts-expect-error: no type definition for showdown-footnotes
import footnotes from 'showdown-footnotes'
import katex from 'katex'
import { ZodError } from 'astro/zod'

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
    const result = await parseFn
    return result
  } catch (err) {
    if (err instanceof ZodError) {
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

export function typedObjectKeys<T extends object>(obj: T) {
  return Object.keys(obj) as [keyof typeof obj]
}
