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

## 文档约定

后续编写/修改页面请遵循：

- **机器人定位**：本 Bot 是运行在 QQ 官方机器人平台上的 **QQ 群机器人**（非服务号），介绍性表述统一用「群机器人」；
- **@ 提及**：机器人账号名为 **Hikari**，所有 @ 提及统一写作 `@Hikari`，不写「@机器人」；叙述文字泛指机器人本身时可用「机器人」；
- **命令格式**：命令一律用行内代码包裹，如 `#add`、`#list 关键词`、`@Hikari phi b19`；多行交互示例用代码块；
- **官方界面原文**：引用 QQ 设置界面文字（如「获取@机器人的最近10条消息」）保持原文不改写——注意此类界面标签中的「@机器人」不属于上述 @ 提及约定；
- **模块页结构**：参照 `docs/modules/example.md` 模板——简介 → 命令列表（按权限分表）→ 使用示例 → 注意事项。

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

## 站点信息与品牌

- 站点标题、描述、GitHub 链接（socialLinks/editLink）、sitemap 域名集中在 `docs/.vitepress/config.mts`；`sitemap.hostname` 按 CF Pages 默认项目名预填（`hikari-bot-docs.pages.dev`），部署后如项目名不同或绑定了自定义域名，需回来同步修改；
- 首页 hero 文案与功能卡片在 `docs/index.md`；
- 图标：站点图标 `docs/public/favicon.ico` 由 Bot 头像 `docs/public/Bot-Avatar.jpg` 生成；头像更换后运行 `node scripts/gen-favicon.cjs` 重新生成（使用 Yunzai 目录下的 sharp，多尺寸打包）。

页面内容中标记了 `<!-- TODO -->` 的地方按实际情况填写。

## 部署到阿里云 ESA Pages

托管平台为**阿里云 ESA Pages**（公测期免费），自定义域名 `docs.hikaribot.cn`。

1. 代码仓库：[Temmie0125/Hikari-Bot-Docs](https://github.com/Temmie0125/Hikari-Bot-Docs)（SSH：`git@github.com:Temmie0125/Hikari-Bot-Docs.git`），本地已关联 `origin`，直接 `git push` 即可；
2. 阿里云控制台开通 **边缘安全加速 ESA**，并开通「函数和 Pages」服务（公测免费）；
3. 创建 Pages 项目 → 连接 GitHub 仓库 `Hikari-Bot-Docs`（`main` 分支）；
4. 构建设置：
   - 构建命令：`npm install && npm run docs:build`（ESA 构建机用 npm 最稳；也可 corepack 启用 pnpm）
   - 构建输出目录：`docs/.vitepress/dist`
   - Node 版本：≥ 18（有选项则选 22）
5. 部署完成先用临时测试域名验证页面；
6. 绑定自定义域名 `docs.hikaribot.cn`：站点加速区域**免备案方案选「全球（不含中国内地）」**；按提示在域名 DNS 处添加 CNAME 记录，证书自动签发；
7. 之后每次 `git push` 到 `main` 自动重新构建发布；
8. `sitemap.hostname` 已预填 `https://docs.hikaribot.cn`（`config.mts`）。

> **大陆加速与备案**：ESA 加速区域含「中国内地」时域名必须完成 ICP 备案；备案需阿里云**备案服务码**（来自账号下符合条件的大陆云产品如 ECS / 轻量应用服务器，或单独购买）。建议先免备案上线，国内访问不满意再走备案：[阿里云备案平台](https://beian.aliyun.com)。备案通过后页脚需悬挂备案号（`config.mts` footer 预留）。
>
> 备选：Cloudflare Pages 亦可托管（构建命令 `pnpm run docs:build`，输出目录同上），同样免备案。

## 搜索说明

站点使用 VitePress 内置本地搜索（mini 全文索引，纯前端、免费、无需外部服务），右上角搜索框或 `Ctrl + K` 呼出。内容更新后重新构建即自动重建索引。
