import fs from 'fs'
import imagemin from 'imagemin'
import { imageSize } from 'image-size'
import resizeImg from 'resize-image-buffer'
import imageminJpegtran from 'imagemin-jpegtran'

export async function getBase64ImageUrl(imagePath) {
  const buffer = Buffer.from(fs.readFileSync(imagePath))
  const { width, height } = imageSize(buffer)
  const resizedImage = await resizeImg(buffer, { width: 10, height: (height * 10) / width })
  const minified = await imagemin.buffer(resizedImage, {
    plugins: [imageminJpegtran()],
  })
  const base64 = Buffer.from(minified).toString('base64')
  return { width, height, data: `data:image/jpeg;base64,${base64}` }
}
