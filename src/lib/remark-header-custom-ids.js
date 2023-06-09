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

const commonPatch = (node, index, parent) => {
  const data = patch(node, 'data', {})
  patch(data, 'htmlAttributes', {})
  patch(data, 'hProperties', {})
  return data
}

const imageAttrs = (node, index, parent) => {
  const data = commonPatch(node)
  patch(data.htmlAttributes, 'loading', 'lazy')
  patch(data.hProperties, 'loading', 'lazy')
}

const headingAttrs = (node, index, parent, maintainCase) => {
  let id = slugs.slug(toString(node), maintainCase)
  const data = commonPatch(node)
  patch(data, 'id', id)
  patch(data.htmlAttributes, 'id', id)
  patch(data.hProperties, 'id', id)
}

const nodePatcher = (node, index, parent, maintainCase) => {
  if (node) {
    if (node.type) {
      if (node.type === 'heading') headingAttrs(node, index, parent, maintainCase)
      if (node.type === 'image') imageAttrs(node, index, parent)
    }
    if (node.children) {
      node.children.forEach((i) => {
        nodePatcher(i, index, parent, maintainCase)
      })
    }
  }
}

export default function ({ maintainCase = false } = {}) {
  slugs.reset()
  return function transformer(tree) {
    visit(tree, (node, index, parent) => {
      nodePatcher(node, index, parent, maintainCase)
    })
  }
}
