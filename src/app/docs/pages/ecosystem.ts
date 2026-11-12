import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-ecosystem',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="生态" heading="社区项目">
        第三方 A2UI 渲染器、智能体库与目录的名单。官方 SDK 与渲染器见<a routerLink="/docs/sdks">SDK 一览</a>，
        工具链路线见<a routerLink="/docs/roadmap">路线图</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <blockquote>
        <p>下列项目由各自作者维护，而非 A2UI 核心团队。选用前请核对仓库的许可、支持的协议版本与发布状态。</p>
      </blockquote>

      <h2 id="renderers">社区渲染器</h2>
      <table>
        <thead><tr><th scope="col">项目</th><th scope="col">平台</th><th scope="col">版本</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><a href="https://github.com/easyops-cn/a2ui-sdk" target="_blank" rel="noopener">easyops-cn/a2ui-sdk</a></td><td>React（Web）</td><td>v0.8</td><td>Radix UI + Tailwind；带文档站。</td></tr>
          <tr><td><a href="https://github.com/lmee/A2UI-Android" target="_blank" rel="noopener">lmee/A2UI-Android</a></td><td>Android（Compose）</td><td>v0.8</td><td>Android 5.0+，20+ 组件，含无障碍支持。</td></tr>
          <tr><td><a href="https://github.com/sivamrudram-eng/a2ui-react-native" target="_blank" rel="noopener">a2ui-react-native</a></td><td>React Native</td><td>v0.8</td><td>iOS + Android 单 TypeScript 代码库。</td></tr>
          <tr><td><a href="https://www.npmjs.com/package/@zhama/a2ui" target="_blank" rel="noopener">zhama/a2ui</a></td><td>React（Web）</td><td>v0.8</td><td>npm 发布的渲染器。</td></tr>
          <tr><td><a href="https://github.com/jem-computer/A2UI-react" target="_blank" rel="noopener">jem-computer/A2UI-react</a></td><td>React（Web）</td><td>v0.8</td><td>React 渲染器实现。</td></tr>
          <tr><td><a href="https://github.com/BBC6BAE9/a2ui-swift" target="_blank" rel="noopener">BBC6BAE9/a2ui-swift</a></td><td>Apple 原生</td><td>v0.8 / v0.9.x</td><td>SwiftUI/UIKit/AppKit，覆盖 iOS、iPadOS、macOS、tvOS、visionOS、watchOS。</td></tr>
          <tr><td><a href="https://github.com/shawnwang15/a2ui-vue" target="_blank" rel="noopener">a2ui-vue</a></td><td>Vue（Web）</td><td>v0.8 / v0.9.x</td><td>带交互文档与演示。</td></tr>
          <tr><td><a href="https://github.com/AGenUI/AGenUI" target="_blank" rel="noopener">AGenUI</a></td><td>iOS/Android/HarmonyOS</td><td>v0.9.x</td><td>共享 C++ 核心；自定义 Table、Carousel、Web 组件。</td></tr>
          <tr><td><a href="https://github.com/lynx-family/lynx-stack/tree/main/packages/genui/a2ui" target="_blank" rel="noopener">@lynx-js/genui</a></td><td>Lynx（移动/Web/桌面）</td><td>v0.9.x</td><td>ReactLynx + MessageStore；带 GenUI Playground。</td></tr>
          <tr><td><a href="https://github.com/BoteAI/a2ui" target="_blank" rel="noopener">BoteAI/a2ui</a></td><td>React(Web)</td><td>v0.8 / v0.9.x</td><td>@boteai/a2ui-render。</td></tr>
          <tr><td><a href="https://github.com/kokoro-ele/a2ui-ink" target="_blank" rel="noopener">a2ui-ink</a></td><td>终端（Ink）</td><td>v0.9.x</td><td>命令行环境的 A2UI 渲染。</td></tr>
          <tr><td><a href="https://github.com/charmbracelet/a2tea" target="_blank" rel="noopener">charmbracelet/a2tea</a></td><td>Go 终端（Bubble Tea）</td><td>v0.9.x</td><td>交互式终端渲染，带文档站。</td></tr>
          <tr><td><a href="https://github.com/muncus/a2term" target="_blank" rel="noopener">muncus/a2term</a></td><td>Go 终端（Bubble Tea + A2A）</td><td>v0.9.x</td><td>键盘可导航的标签界面。</td></tr>
          <tr><td><a href="https://github.com/yessGlory17/generative-mui" target="_blank" rel="noopener">generative-mui</a></td><td>React + Material UI</td><td>v0.9.x</td><td>继承 ThemeProvider；校验与流式占位。</td></tr>
          <tr><td><a href="https://github.com/ChaliceForAuri/a2ui-svelte" target="_blank" rel="noopener">svelte-a2ui</a></td><td>Svelte 5（Web）</td><td>v1.0</td><td>HTTP JSONL/SSE 与 A2A 传输；带演示。</td></tr>
          <tr><td><a href="https://github.com/Language-Lit/material3-expressive-a2ui" target="_blank" rel="noopener">material3-expressive-a2ui</a></td><td>React + Material 3 Expressive</td><td>v0.9.x</td><td>构建于 @a2ui/web_core；带演示与文档。</td></tr>
          <tr><td><a href="https://github.com/uny/a2ui-compose" target="_blank" rel="noopener">uny/a2ui-compose</a></td><td>Compose Multiplatform</td><td>v1.0</td><td>Android/iOS/桌面/macOS/Web；Maven 发布。</td></tr>
          <tr><td><a href="https://www.npmjs.com/package/@xpert-ai/a2ui-react" target="_blank" rel="noopener">xpert-ai/a2ui-react</a></td><td>React（Web）</td><td>早期</td><td>基于 ShadCN UI。</td></tr>
          <tr><td><a href="https://github.com/josh-english-2k18/a2ui-3d-renderer" target="_blank" rel="noopener">a2ui-3d-renderer</a></td><td>WebGL / Three.js</td><td>实验</td><td>3D 渲染器探索。</td></tr>
          <tr><td><a href="https://github.com/AINative-Studio/ai-kit-a2ui" target="_blank" rel="noopener">ai-kit-a2ui</a></td><td>React（Web）</td><td>早期</td><td>React + ShadCN，面向 AIKit 框架。</td></tr>
        </tbody>
      </table>

      <h2 id="agent-libs">智能体库</h2>
      <table>
        <thead><tr><th scope="col">项目</th><th scope="col">语言</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><a href="https://github.com/Max-Health-Inc/prefab" target="_blank" rel="noopener">prefab</a></td><td>TypeScript</td><td>类型化组件树 → A2UI payload；校验目录；以 <code>a2ui://</code> 通过 MCP 提供。</td></tr>
          <tr><td><a href="https://github.com/satorunooshie/a2ui-go" target="_blank" rel="noopener">a2ui-go</a></td><td>Go</td><td>传输无关的 v0.9.1 原语：schema 校验、解码、action 路由。</td></tr>
          <tr><td><a href="https://github.com/tmc/a2ui" target="_blank" rel="noopener">tmc/a2ui</a></td><td>Go</td><td>v0.9.x 类型与流式 JSONL 解析器（<code>a2uistream</code>）。</td></tr>
        </tbody>
      </table>

      <h2 id="catalogs">目录与组件库</h2>
      <table>
        <thead><tr><th scope="col">项目</th><th scope="col">平台</th><th scope="col">版本</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><a href="https://github.com/googlemaps/a2ui" target="_blank" rel="noopener">googlemaps/a2ui</a></td><td>Web（Lit）/Android/iOS/Python 智能体</td><td>v0.9.x（实验）</td><td>Google Maps Agentic UI 工具包：追加 <code>GoogleMap</code> 与 <code>PlaceDetailsCompact</code>；Python 侧支持 ADK 与 A2A。</td></tr>
        </tbody>
      </table>

      <h2 id="related">相关生成式 UI 项目</h2>
      <table>
        <thead><tr><th scope="col">项目</th><th scope="col">平台</th><th scope="col">与 A2UI 的关系</th></tr></thead>
        <tbody>
          <tr><td><a href="https://github.com/vercel-labs/json-render" target="_blank" rel="noopener">vercel-labs/json-render</a></td><td>React/Vue/Svelte/Solid/React Native</td><td>自有 JSON schema + Zod 目录与流式；附带 A2UI 适配器。</td></tr>
          <tr><td><a href="https://github.com/thesysdev/openui/tree/main/packages/a2ui" target="_blank" rel="noopener">thesysdev/openui</a></td><td>框架无关核心 + React 适配器</td><td>遵循 A2UI v1.0 的 surface/信封生命周期，但发送 OpenUI Lang 语句而非基础目录 JSON；与标准智能体不是即插即用。</td></tr>
        </tbody>
      </table>

      <h2 id="submit">提交你的项目</h2>
      <ol>
        <li>Fork <a href="https://github.com/a2ui-project/a2ui" target="_blank" rel="noopener">a2ui-project/a2ui</a> 并签署 Google CLA。</li>
        <li>在 <code>docs/site/src/content/docs/ecosystem/renderers.mdx</code> 添加一行条目。</li>
        <li>开 PR，附验证细节与演示链接；也可在 GitHub Discussions 分享。</li>
      </ol>
      <h3 id="criteria">收录标准</h3>
      <ul>
        <li>开源（通常 Apache 2.0 或 MIT）。</li>
        <li>文档写明支持的协议版本。</li>
        <li>渲染器覆盖核心布局、文本、输入与动作组件。</li>
        <li>清晰的安装说明与可运行示例。</li>
        <li>持续维护；停止维护的项目会被归档。</li>
      </ul>
      <h3 id="conduct">行为准则与安全报告</h3>
      <p>社区参与遵循 Google 开源社区指南（见仓库 CONTRIBUTING.md）：讨论在 GitHub Discussions，
      Bug 在 GitHub Issues；安全问题通过 Google Vulnerability Reporting 私下报告，不要开公开 issue。</p>
    </div>
  `,
})
export class EcosystemPage {}