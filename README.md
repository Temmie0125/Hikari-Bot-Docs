# Bot 文档站

基于 [VitePress](https://vitepress.dev/zh/) 的机器人使用文档 / 帮助中心，部署于 Cloudflare Pages。

## 本地开发

```bash
pnpm install        # 安装依赖
pnpm docs:dev       # 启动开发服务器 http://localhost:5173
pnpm docs:build     # 构建产物到 docs/.vitepress/dist
pnpm docs:preview   # 本地预览构建产物
```

## 目录结构

```
docs/
├── .vitepress/
│   └── config.mts      # 站点配置：导航栏、侧边栏、搜索、页脚
├── index.md            # 首页（hero + 功能卡片）
├── start/              # 「开始使用」板块
│   ├── index.md        #   快速上手
│   ├── qqbot.md        #   QQ 官方 Bot 使用须知
│   └── faq.md          #   常见问题
├── modules/            # 功能模块板块（每个模块一个 md 文件）
│   ├── index.md        #   功能一览索引表
│   ├── example.md      #   模块文档模板（复制它来新增模块）
│   ├── famous.md       #   名场面
│   └── phigros.md      #   音游查分
├── about/
│   └── index.md        # 关于 / 加群 / 反馈
└── public/             # 静态资源（favicon 等，原样拷贝）
```

## 如何新增功能模块

1. 复制 `docs/modules/example.md`，重命名为模块名（英文或拼音，如 `maimai.md`）；
2. 修改文件顶部 frontmatter：
   ```yaml
   ---
   title: 模块显示名     # 侧边栏显示的名称
   order: 30            # 排序，数字越小越靠前
   ---
   ```
3. 按模板填写「命令列表 / 使用示例 / 注意事项」；
4. 在 `docs/modules/index.md` 的索引表中补一行链接。

**侧边栏自动更新**：`config.mts` 会扫描 `modules/` 目录自动生成侧边栏，增删模块页面不需要改配置。

## 如何修改站点信息（部署前必做的占位符替换）

全站占位符集中在两处：

- `docs/.vitepress/config.mts`：`title`（站名）、`description`、`footer`、`socialLinks` 与 `editLink` 里的 GitHub 仓库地址、`sitemap.hostname`（部署后填实际域名）；
- `docs/index.md`：hero 区的 `name`（Bot 名称）、`tagline`、功能卡片文案；
- 图标：站点图标 `docs/public/favicon.ico` 由 Bot 头像 `docs/public/Bot-Avatar.jpg` 生成；头像更换后运行 `node scripts/gen-favicon.cjs` 重新生成（使用 Yunzai 目录下的 sharp，多尺寸打包）。

其余页面内容中标记了 `<!-- TODO -->` 的地方按实际情况填写。

## 部署到 Cloudflare Pages

1. 在 GitHub 新建**公开或私有仓库**（如 `bot-docs`），推送本目录：
   ```bash
   git remote add origin https://github.com/<你的用户名>/bot-docs.git
   git push -u origin main
   ```
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers 和 Pages** → **创建** → **Pages** → **连接到 Git**，选择刚推送的仓库；
3. 构建设置：
   - 框架预设：`VitePress`（没有就选 None）
   - 构建命令：`pnpm run docs:build`
   - 构建输出目录：`docs/.vitepress/dist`
4. 点保存并部署，约一分钟后即可通过 `https://<项目名>.pages.dev` 访问；
5. 之后每次 `git push` 到 `main`，Cloudflare 会自动重新构建发布。

> 自定义域名：目前没有域名可先用 `*.pages.dev`；日后购买域名并将 NS 托管到 Cloudflare 后，在 Pages 项目 → 自定义域 中添加即可，证书自动签发。

## 搜索说明

站点使用 VitePress 内置本地搜索（mini 全文索引，纯前端、免费、无需外部服务），右上角搜索框或 `Ctrl + K` 呼出。内容更新后重新构建即自动重建索引。
