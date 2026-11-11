import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-ecosystem',
  imports: [RouterLink],
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-faint">构建 / 生态与路线图</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">生态与路线图</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        官方 SDK、社区渲染器、可视化工具,以及从第一个组件到生产环境的五阶段路线图。
      </p>
    </header>

    <div class="doc-prose">
      <h2 id="packages">官方包一览</h2>
      <table>
        <thead><tr><th>语言</th><th>包</th><th>层</th></tr></thead>
        <tbody>
          <tr><td rowspan="4">TypeScript</td><td><code>@a2ui/web_core</code></td><td>Core(v0.8 / v0.9.1 / v1.0)</td></tr>
          <tr><td><code>@a2ui/agent</code></td><td>Agent</td></tr>
          <tr><td><code>@a2ui/react</code> · <code>@a2ui/angular</code> · <code>@a2ui/lit</code></td><td>Renderer</td></tr>
          <tr><td><code>@a2ui/markdown-it</code> · <code>@a2ui/catalog-mcp</code></td><td>Markdown 渲染 / MCP 组件</td></tr>
          <tr><td rowspan="2">Python</td><td><code>a2ui-core</code> · <code>a2ui-agent-sdk</code></td><td>Core / Agent</td></tr>
          <tr><td><code>a2ui-adk</code> · <code>a2ui-a2a</code></td><td>Google ADK / A2A 集成</td></tr>
          <tr><td>Dart</td><td><code>a2ui_core</code> · <code>a2ui_agent</code> · <code>a2ui_flutter</code></td><td>Core / Agent / Renderer</td></tr>
          <tr><td>Swift</td><td><code>A2UISwiftCore</code> · <code>A2UISwiftUI</code> · <code>BasicCatalog</code></td><td>Core / Renderer(SPM)</td></tr>
          <tr><td>Kotlin</td><td><code>androidx.a2ui</code> · <code>androidx.a2ui.compose</code> · <code>material3-a2ui</code></td><td>Core / Renderer(v0.9.1)</td></tr>
        </tbody>
      </table>

      <h2 id="tools">工具</h2>
      <div class="not-prose mt-5 grid gap-3 sm:grid-cols-2">
        <a href="https://a2ui-editor.ag-ui.com" target="_blank" rel="noopener" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">A2UI Composer</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">可视化工作台:提示助手、检查流式消息与 dataModel 更新、并排编辑 surface。</span>
        </a>
        <a href="https://go.copilotkit.ai/a2ui-playground" target="_blank" rel="noopener" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">CopilotKit Playground</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">浏览器沙箱,零安装试用 A2UI 提示词与组件目录。</span>
        </a>
        <a href="https://github.com/a2ui-project/a2ui/tree/main/dart/a2ui_cli" target="_blank" rel="noopener" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">A2UI CLI</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">a2ui codegen 从目录生成类型安全的组件构建器;目标是覆盖全部五个阶段。</span>
        </a>
        <a href="https://github.com/a2ui-project/a2ui/tree/main/eval" target="_blank" rel="noopener" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">评估框架</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">基于 Inspect AI:schema 校验、确定性断言、LLM 评审三阶段打分。</span>
        </a>
      </div>

      <h2 id="community">社区渲染器与库</h2>
      <p>第三方项目由各自作者维护,选用前请核对仓库的许可、协议版本支持与发布状态:</p>
      <table>
        <thead><tr><th>项目</th><th>平台</th><th>版本</th><th>说明</th></tr></thead>
        <tbody>
          <tr><td><a href="https://github.com/shawnwang15/a2ui-vue" target="_blank" rel="noopener">a2ui-vue</a></td><td>Vue</td><td>v0.8 / v0.9.x</td><td>带交互文档与演示的 Vue 渲染器。</td></tr>
          <tr><td><a href="https://github.com/ChaliceForAuri/a2ui-svelte" target="_blank" rel="noopener">svelte-a2ui</a></td><td>Svelte 5</td><td>v1.0</td><td>runes 渲染器,支持 JSONL/SSE 与 A2A。</td></tr>
          <tr><td><a href="https://github.com/lynx-family/lynx-stack/tree/main/packages/genui/a2ui" target="_blank" rel="noopener">@lynx-js/genui</a></td><td>Lynx(移动/Web/桌面)</td><td>v0.9.x</td><td>ReactLynx 跨平台渲染器。</td></tr>
          <tr><td><a href="https://github.com/uny/a2ui-compose" target="_blank" rel="noopener">uny/a2ui-compose</a></td><td>Compose Multiplatform</td><td>v1.0</td><td>Android/iOS/桌面/Web 单代码库。</td></tr>
          <tr><td><a href="https://github.com/BBC6BAE9/a2ui-swift" target="_blank" rel="noopener">BBC6BAE9/a2ui-swift</a></td><td>Apple 全平台</td><td>v0.8 / v0.9.x</td><td>SwiftUI/UIKit/AppKit,遵循 HIG。</td></tr>
          <tr><td><a href="https://github.com/AGenUI/AGenUI" target="_blank" rel="noopener">AGenUI</a></td><td>iOS/Android/HarmonyOS</td><td>v0.9.x</td><td>共享 C++ 核心,自定义 Table/Carousel/Web 组件。</td></tr>
          <tr><td><a href="https://github.com/charmbracelet/a2tea" target="_blank" rel="noopener">charmbracelet/a2tea</a></td><td>Go 终端</td><td>v0.9.x</td><td>Bubble Tea 交互式终端渲染。</td></tr>
          <tr><td><a href="https://github.com/kokoro-ele/a2ui-ink" target="_blank" rel="noopener">a2ui-ink</a></td><td>终端(Ink)</td><td>v0.9.x</td><td>命令行环境的 A2UI 渲染。</td></tr>
          <tr><td><a href="https://github.com/sivamrudram-eng/a2ui-react-native" target="_blank" rel="noopener">a2ui-react-native</a></td><td>React Native</td><td>v0.8</td><td>iOS/Android 单 TypeScript 代码库。</td></tr>
          <tr><td><a href="https://github.com/googlemaps/a2ui" target="_blank" rel="noopener">googlemaps/a2ui</a></td><td>Web/Android/iOS/Python</td><td>v0.9.x</td><td>Google Maps 领域目录:GoogleMap、PlaceDetailsCompact。</td></tr>
          <tr><td><a href="https://github.com/easyops-cn/a2ui-sdk" target="_blank" rel="noopener">easyops-cn/a2ui-sdk</a></td><td>React</td><td>v0.8</td><td>Radix UI + Tailwind 的 React 渲染器。</td></tr>
          <tr><td><a href="https://www.npmjs.com/package/@xpert-ai/a2ui-react" target="_blank" rel="noopener">xpert-ai/a2ui-react</a></td><td>React</td><td>早期</td><td>基于 ShadCN UI 的渲染器。</td></tr>
        </tbody>
      </table>
      <p>服务端还有 Go 库(<a href="https://github.com/satorunooshie/a2ui-go" target="_blank" rel="noopener">a2ui-go</a>、
      <a href="https://github.com/tmc/a2ui" target="_blank" rel="noopener">tmc/a2ui</a>)与 TypeScript 的
      <a href="https://github.com/Max-Health-Inc/prefab" target="_blank" rel="noopener">prefab</a>;
      相关生成式 UI 项目包括 Vercel 的 json-render(带 A2UI 适配器)与 OpenUI。
      完整名单与提交方式见 <a href="https://a2ui.org/ecosystem/renderers/" target="_blank" rel="noopener">官方社区项目页</a>。</p>

      <h2 id="adopters">采用者</h2>
      <p>Gemini 的生成式界面基于 A2UI;Atlassian、Alation、ByteDance 等团队已在产品中使用或集成;
      AG-UI 与 CopilotKit 把它作为智能体到前端的界面通道。协议由 Google 发起,与社区在
      <a href="https://github.com/a2ui-project/a2ui" target="_blank" rel="noopener">GitHub</a> 上共同维护。</p>

      <h2 id="roadmap">路线图:五个阶段</h2>
      <p>发布一个生成式 UI 智能体是一个循环:构建组件 → 配置智能体 → 评估质量 → 分发 → 监控演进,
      监控学到的东西回到组件工作。A2UI CLI 的目标是让你(或你的编码智能体)在终端里跑完整个循环。</p>
      <table>
        <thead><tr><th>阶段</th><th>今天可用</th><th>规划中</th></tr></thead>
        <tbody>
          <tr><td>构建组件</td><td>目录、基础目录、六个渲染器、Universal Web Components、codegen、Composer</td><td>可声明式描述的原语、运行时模板引擎、共享业务逻辑的安全沙箱</td></tr>
          <tr><td>配置智能体</td><td>SkillGenerator、目录协商、推理格式、有状态校验、ADK/A2A 集成</td><td>决策模型(如 Jev)推理格式、Dart 技能生成、更多框架集成</td></tr>
          <tr><td>评估质量</td><td>Inspect AI 评估框架、token/延迟基准</td><td>面向自有智能体与目录的评估工具:规则 + LLM 评审 + 工具调用评审</td></tr>
          <tr><td>分发</td><td>Web/移动渲染器、MCP 双向互嵌(A2UI in MCP App / McpApp 组件)</td><td>MCP Apps 状态共享工具、Gemini/Claude/ChatGPT 与 Teams/Slack 分发指南</td></tr>
          <tr><td>监控演进</td><td>action 与函数结果消息作为事件源</td><td>日志采集指南、把信号转化为组件更新的闭环</td></tr>
        </tbody>
      </table>

      <h3 id="versions">协议版本状态</h3>
      <table>
        <thead><tr><th>版本</th><th>状态</th></tr></thead>
        <tbody>
          <tr><td>v1.0</td><td>当前(Current)</td></tr>
          <tr><td>v0.9.1 / v0.9</td><td>上一代(Previous)</td></tr>
          <tr><td>v0.8</td><td>已弃用(Deprecated)</td></tr>
        </tbody>
      </table>

      <h2 id="contribute">参与</h2>
      <ul>
        <li>讨论与提问:<a href="https://github.com/a2ui-project/a2ui/discussions" target="_blank" rel="noopener">GitHub Discussions</a>。</li>
        <li>Bug 与功能请求:<a href="https://github.com/a2ui-project/a2ui/issues" target="_blank" rel="noopener">GitHub Issues</a>。</li>
        <li>提交社区项目:fork 仓库,在生态页添加条目并附验证细节,开 PR。</li>
        <li>实现新语言的 SDK:按 <code>blueprints/modules</code> 规范开发,用 <code>conformance/</code> 的 YAML 套件验证一致性。</li>
      </ul>
      <p>想先动手感受协议本身,回到<a routerLink="/playground">Playground</a>。</p>
    </div>
  `,
})
export class EcosystemPage {}