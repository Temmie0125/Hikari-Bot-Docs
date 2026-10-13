import { defineConfig, type DefaultTheme } from 'vitepress'
import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// ==================== TODO 站点信息占位符，部署前替换 ====================
// 1. title / description / footer 里的 Bot 名称
// 2. socialLinks / editLink 里的 GitHub 仓库地址
// 3. sitemap.hostname 部署后改为实际域名（如 https://xxx.pages.dev）
// ========================================================================

const modulesDir = fileURLToPath(new URL('../modules', import.meta.url))

interface ModuleMeta {
  text: string
  link: string
  order: number
}

// 扫描 docs/modules/ 下所有 md 文件，自动生成侧边栏：
// 新增/删除模块页面无需改配置，frontmatter 里的 title 决定显示名，order 决定排序（小的在前）
function scanModules(): ModuleMeta[] {
  const items: ModuleMeta[] = []
  for (const file of readdirSync(modulesDir)) {
    if (!file.endsWith('.md') || file === 'index.md') continue
    const raw = readFileSync(join(modulesDir, file), 'utf-8')
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1] ?? ''
    const title =
      /^title:\s*["']?(.+?)["']?\s*$/m.exec(fm)?.[1] ??
      /^#\s+(.+)$/m.exec(raw)?.[1] ??
      basename(file, '.md')
    const order = Number(/^order:\s*(\d+)/m.exec(fm)?.[1] ?? 100)
    items.push({ text: title, link: `/modules/${basename(file, '.md')}`, order })
  }
  items.sort((a, b) => a.order - b.order || a.text.localeCompare(b.text, 'zh'))
  return items
}

const moduleItems = scanModules()

const moduleSidebar: DefaultTheme.SidebarItem[] = [
  { text: '功能一览', link: '/modules/' },
  ...moduleItems,
]

const startSidebar: DefaultTheme.SidebarItem[] = [
  { text: '开始使用', link: '/start/' },
  { text: 'QQ 官方 Bot 使用须知', link: '/start/qqbot' },
  { text: '常见问题', link: '/start/faq' },
]

const aboutSidebar: DefaultTheme.SidebarItem[] = [
  { text: '关于', link: '/about/' },
  { text: '用户协议', link: '/about/terms' },
  { text: '隐私政策', link: '/about/privacy' },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'Bot 文档', // TODO: 换成你的 Bot 名称
  description: 'QQ 机器人使用说明与帮助文档',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]],
  sitemap: { hostname: 'https://example.pages.dev' }, // TODO: 部署后改为实际域名
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '开始使用', link: '/start/', activeMatch: '/start/' },
      { text: '功能模块', link: '/modules/', activeMatch: '/modules/' },
      { text: '关于', link: '/about/' },
    ],

    sidebar: {
      '/start/': startSidebar,
      '/modules/': moduleSidebar,
      '/about/': aboutSidebar,
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/yourname/bot-docs' }], // TODO: 换成实际仓库

    footer: {
      message:
        '基于 Yunzai 构建的 QQ 机器人 · <a href="/about/terms.html">用户协议</a> · <a href="/about/privacy.html">隐私政策</a>',
      copyright: 'Copyright © 2026 Hikari-Bot', // TODO: 换成你的署名
    },

    outline: { level: [2, 3], label: '本页目录' },
    lastUpdated: { text: '最后更新于' },
    docFooter: { prev: '上一页', next: '下一页' },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    editLink: {
      pattern: 'https://github.com/yourname/bot-docs/edit/main/docs/:path', // TODO: 换成实际仓库
      text: '在 GitHub 上编辑此页',
    },
  },
})
