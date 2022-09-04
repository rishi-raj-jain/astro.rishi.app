import { createServer } from 'http'
import { handler as ssrHandler } from './dist/server/entry.mjs'

async function handle(req, res) {
  ssrHandler(req, res, async (err) => {
    if (err) {
      res.writeHead(500)
      res.end(err.stack)
      return
    }
  })
}

const server = createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err)
    res.writeHead(500, {
      'Content-Type': 'text/plain',
    })
    res.end(err.toString())
  })
})

server.listen(process.env.PORT || 3000)
console.log(`Serving at http://localhost:${process.env.PORT || 3000}`)
