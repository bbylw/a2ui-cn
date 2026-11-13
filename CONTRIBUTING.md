# 贡献指南

本仓库是 **A2UI 中文站**：A2UI（Agent-to-User Interface）协议的中文文档站与交互演示。

> `README.md` 是上游 [a2ui-project/a2ui](https://github.com/a2ui-project/a2ui/blob/main/README.md) README
> 的中文翻译，介绍 A2UI 项目本身，按上游内容同步、不要按本站语境改写。**本站**的开发与维护说明放在本文件。

- 基于 **Angular 22** 构建，通过 React Island 在页面内挂载 **React 19** 渲染器，用同一份 A2UI v1.0 消息流同时驱动 `@a2ui/angular` 与 `@a2ui/react` 两套渲染器，便于直观对比。样式使用 Tailwind CSS 4。
- 36 篇中文文档，覆盖协议、Schema、目录、数据绑定、Action、MCP 集成与 v1.0 / v0.9.1 规范。
- **Playground**：逐条播放协议消息、单步 / 跳转 / 循环、编辑自定义 JSON、查看 action 回传日志。
- 内容基于 [a2ui.org](https://a2ui.org/) 官方文档整理，协议本身为 Apache-2.0。

## 环境要求

| 依赖    | 版本                                                            |
| ------- | --------------------------------------------------------------- |
| Node.js | `^22.22.3` 或 `^24.15.0` 或 `>=26.0.0`（Angular 22 的硬性要求） |
| bun     | 1.4+                                                            |

> 本项目统一使用 **bun** 作为包管理器与脚本运行器，不使用 npm。

## 常用命令

```bash
bun install                 # 安装依赖（bun.lock 已提交）
bun run start               # 开发服务器 http://localhost:4200/
bun run build               # 生产构建，产物在 dist/a2ui-cn/browser
bun run watch               # 开发模式增量构建
bun run test                # 单元测试（watch 模式）
bun run test:ci             # 单元测试单次运行
bun run check               # TypeScript 类型检查（不产出文件）
bun run format              # Prettier 格式化
bun run format:check        # 检查格式，适合 CI
```

## 目录结构

```
src/app/
  core/           # 示例消息场景、action 日志、代码高亮
  shared/         # React Island 桥接、代码块、滚动揭示、文档锚点与标题策略
  landing/        # 首页各区块（含双渲染器演示）
  docs/           # 文档布局与 36 个页面组件（全部按路由懒加载）
  react/          # React 侧的 Playground、Surface 预览与 UI 组件
  app.routes.ts   # 路由表
  app.config.ts   # Angular providers 与 A2UI 配置
```

## 架构说明

- Angular 是宿主框架，React 只通过 `ReactIsland` 动态 `import()` 挂载到独立 root，互不共享状态。
- `app.config.ts` 用 `provideA2UI()` 配置 Angular 渲染器（`web_core/v0_9` 的 markdown renderer）；React 侧由 `ensureA2uiSetup()` 配置 `web_core/v1_0` 的样式与 markdown renderer。两者对应不同版本的 web_core 子路径，**都需要保留**。
- 页面组件全部用 `loadComponent` 懒加载，生产构建按页切分 chunk。

## 已知事项

- 上游 `@a2ui/angular@0.14.0` 的 `peerDependencies` 仍声明 `@angular/core ^21.2.5`，`@a2ui/markdown-it@0.2.2` 仍声明 `@a2ui/web_core ^0.14.0`；当前 npm 上这两个包尚无更新的发布版。本站使用 Angular 22.2 + `web_core` 0.15.0，构建与运行均已验证通过，属于上游元数据滞后。**当前决策：等待上游发布修正版**——不使用 `overrides` 掩盖警告，也不降级 Angular；升级 A2UI 或 Angular 时重新核对官方支持矩阵与 peer 范围。
- `react`、`react-dom`、`scheduler`、`validate-color` 为 CommonJS 依赖，已在 `angular.json` 的 `allowedCommonJsDependencies` 中登记，避免构建警告并明确优化边界。
- 中文字体 `@fontsource-variable/noto-sans-sc` 按 unicode-range 分成 101 个 woff2 分片，`dist` 体积较大属正常现象；浏览器只下载页面实际用到的分片。

## 故障排查

若 CLI 报 `requires a minimum Node.js version`，先用 `type -a node`（Windows PowerShell 为 `Get-Command node.exe -All`）确认优先级最高的 Node 是不是你预期的版本——某些工具链会在 PATH 最前面注入自带的 Node。临时指定版本可在命令前加 `PATH="<node-26-bin>:$PATH"`。
