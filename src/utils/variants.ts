import type { VariantHandlerContext, VariantObject } from '@unocss/core'
import { escapeRegExp } from '@unocss/core'
import { defaultRules, restoreSelector } from 'unplugin-transform-class/utils'
import { getBracket } from '../utils'

export function variantMatcher(name: string, handler: (input: VariantHandlerContext) => Record<string, any>, transformRules: Record<string, string> = defaultRules): VariantObject {
  const re = new RegExp(`^${escapeRegExp(name)}[:-]`)

  return {
    name,
    match(input) {
      input = restoreSelector(input, transformRules)
      const match = input.match(re)
      if (match) {
        return {
          matcher: input.slice(match[0].length),
          handle: (input, next) => next({
            ...input,
            ...handler(input),
          }),
        }
      }
    },
    autocomplete: `${name}:`,
  }
}

export function variantParentMatcher(name: string, parent: string, transformRules: Record<string, string> = defaultRules): VariantObject {
  const re = new RegExp(`^${escapeRegExp(name)}[:-]`)
  return {
    name,
    match(input) {
      input = restoreSelector(input, transformRules)
      const match = input.match(re)
      if (match) {
        return {
          matcher: input.slice(match[0].length),
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ''}${parent}`,
          }),
        }
      }
    },
    autocomplete: `${name}:`,
  }
}

export function variantGetBracket(prefix: string, matcher: string, separators: string[]): string[] | undefined {
  if (matcher.startsWith(`${prefix}[`)) {
    const [match, rest] = getBracket(matcher.slice(prefix.length), '[', ']') ?? []
    if (match && rest) {
      for (const separator of separators) {
        if (rest.startsWith(separator))
          return [match, rest.slice(separator.length), separator]
      }
      return [match, rest, '']
    }
  }
}

export function variantGetParameter(prefix: string, matcher: string, separators: string[]): string[] | undefined {
  if (matcher.startsWith(prefix)) {
    const body = variantGetBracket(prefix, matcher, separators)
    if (body) {
      const [label = '', rest = body[1]] = variantGetParameter('/', body[1], separators) ?? []
      return [body[0], rest, label]
    }
    for (const separator of separators.filter(x => x !== '/')) {
      const pos = matcher.indexOf(separator, prefix.length)
      if (pos !== -1) {
        const labelPos = matcher.indexOf('/', prefix.length)
        const unlabelled = labelPos === -1 || pos <= labelPos
        return [
          matcher.slice(prefix.length, unlabelled ? pos : labelPos),
          matcher.slice(pos + separator.length),
          unlabelled ? '' : matcher.slice(labelPos + 1, pos),
        ]
      }
    }
  }
}
