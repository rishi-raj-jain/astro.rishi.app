/*
 * Based on 'gatsby-remark-autolink-headers'
 * Original Author: Kyle Mathews <mathews.kyle@gmail.com>
 * Updated by Jared Palmer;
 * Copyright (c) 2015 Gatsbyjs
 */

import visit from 'unist-util-visit'
import slugger from 'github-slugger'
import toString from 'mdast-util-to-string'

const slugs = slugger()

const patch = (context, key, value) => {
  if (!context[key]) {
    context[key] = value
  }
  return context[key]
}

const imageAttrs = (node) => {
  const data = patch(node, 'data', {})
  patch(data, 'htmlAttributes', {})
  patch(data, 'hProperties', {})
  patch(data.htmlAttributes, 'loading', 'lazy')
  patch(data.hProperties, 'loading', 'lazy')
}

export default function ({ maintainCase = false } = {}) {
  slugs.reset()
  return function transformer(tree) {
    visit(tree, (node) => {
      if (node) {
        if (node.type === 'heading') {
          const children = node.children
          let tail = children[children.length - 1]
          // Generate slugs on the fly (even if not specified in markdown)
          // so that it's possible to copy anchor links in newly written content.
          let id = slugs.slug(toString(node), maintainCase)
          // However, for committed docs, we'll extract slug from the headers.
          if (tail && tail.type === 'text' && tail.value === '/}') {
            tail = children[children.length - 2]
            if (tail && tail.type === 'emphasis') {
              // Use custom ID instead.
              id = toString(tail)
              // Until we're on MDX 2, we need to "cut off" the comment syntax.
              tail = children[children.length - 3]
              if (tail && tail.type === 'text' && tail.value.endsWith('{/')) {
                // Remove the emphasis and trailing `/}`
                children.splice(children.length - 2, 2)
                // Remove the `{/`
                tail.value = tail.value.replace(/[ \t]*\{\/$/, '')
              }
            }
          }
          const data = patch(node, 'data', {})
          patch(data, 'id', id)
          patch(data, 'htmlAttributes', {})
          patch(data, 'hProperties', {})
          patch(data.htmlAttributes, 'id', id)
          patch(data.hProperties, 'id', id)
        }
        if (node.type === 'image') imageAttrs(node)
        if (node.children) {
          node.children.forEach((i) => {
            if (i.type === 'image') {
              imageAttrs(i)
            }
          })
        }
      }
    })
  }
}
