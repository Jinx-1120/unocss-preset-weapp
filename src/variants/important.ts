import type { VariantObject } from '@unocss/core'
import { restoreSelector } from 'unplugin-transform-class/utils'
import type { Theme } from '../theme'

export function variantImportant(): VariantObject<Theme> {
  let re: RegExp

  return {
    name: 'important',
    match(matcher, ctx) {
      if (!re)
        re = new RegExp(`^(important(?:${ctx.generator.config.separators.join('|')})|!)`)

      let base: string | undefined
      matcher = restoreSelector(matcher, ctx.theme?.transformRules)
      const match = matcher.match(re)
      if (match)
        base = matcher.slice(match[0].length)
      else if (matcher.endsWith('!'))
        base = matcher.slice(0, -1)

      if (base) {
        return {
          matcher: base,
          body: (body) => {
            body.forEach((v) => {
              if (v[1])
                v[1] += ' !important'
            })
            return body
          },
        }
      }
    },
  }
}
