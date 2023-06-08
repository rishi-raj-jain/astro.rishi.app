import fs from 'fs'
import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'

export async function getBase64ImageUrl(imagePath) {
  const buffer = Buffer.from(fs.readFileSync(imagePath))
  const minified = await imagemin.buffer(buffer, {
    plugins: [imageminJpegtran()],
  })
  const base64 = Buffer.from(minified).toString('base64')
  return `data:image/jpeg;base64,${base64}`
}
