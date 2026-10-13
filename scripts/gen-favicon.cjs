// 从 Bot-Avatar.jpg 生成多尺寸 favicon.ico（一次性脚本，用 Yunzai 自带的 sharp）
const path = require('node:path')
const fs = require('node:fs')
const sharp = require(path.join('E:/bot/Yunzai/node_modules/sharp'))

const SRC = 'E:/bot/bot-docs/docs/public/Bot-Avatar.jpg'
const OUT = 'E:/bot/bot-docs/docs/public/favicon.ico'
const SIZES = [16, 32, 48, 64, 128, 256]

async function main() {
  const pngs = []
  for (const size of SIZES) {
    const buf = await sharp(SRC)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer()
    pngs.push({ size, buf })
  }

  // ICO 容器：6 字节头 + N 个 16 字节目录项 + 各尺寸 PNG 数据
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngs.length, 4)

  const dir = Buffer.alloc(16 * pngs.length)
  let offset = header.length + dir.length
  const datas = []
  pngs.forEach((p, i) => {
    const o = i * 16
    const sizeByte = p.size >= 256 ? 0 : p.size // 0 表示 256
    dir[o] = sizeByte
    dir[o + 1] = sizeByte
    dir[o + 2] = 0 // palette colors
    dir[o + 3] = 0 // reserved
    dir.writeUInt16LE(1, o + 4) // planes
    dir.writeUInt16LE(32, o + 6) // bpp
    dir.writeUInt32LE(p.buf.length, o + 8)
    dir.writeUInt32LE(offset, o + 12)
    offset += p.buf.length
    datas.push(p.buf)
  })

  fs.writeFileSync(OUT, Buffer.concat([header, dir, ...datas]))
  console.log('favicon.ico written:', fs.statSync(OUT).size, 'bytes,', SIZES.join('/'))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
