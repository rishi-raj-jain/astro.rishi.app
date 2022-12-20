import prism from 'remark-prism'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import customHeaders from './remark-header-custom-ids'

export default async function markdownToHtml(markdown) {
  const result = await unified().use(remarkParse).use(customHeaders).use(prism).use(remarkRehype).use(rehypeStringify).process(markdown)
  return result.toString()
}
