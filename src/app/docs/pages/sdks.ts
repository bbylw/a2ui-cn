import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-sdks',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="概念" heading="SDK 一览">
        A2UI 的 SDK 分三层:Core 实现协议与状态,Agent 在 Core 之上生成提示词与编译校验,
        Renderer 把状态画成各框架的原生控件。同一语言里三层共享 Core 的数据结构,两侧理解永远一致。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="core">Core SDK</h2>
      <p>框架无关的基础库:消息模型、目录 schema、响应式状态容器
      (SurfaceGroupModel、SurfaceModel、ComponentModel、DataModel)、JSON Pointer 解析、
      表达式求值、MessageProcessor 与校验。</p>
      <table>
        <thead><tr><th scope="col">语言</th><th scope="col">包</th><th scope="col">协议版本</th></tr></thead>
        <tbody>
          <tr><td>TypeScript</td><td><code>@a2ui/web_core</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Python</td><td><code>a2ui-core</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Dart</td><td><code>a2ui_core</code></td><td>v0.9.1 / v1.0</td></tr>
          <tr><td>Swift</td><td><code>A2UISwiftCore</code>、<code>BasicCatalog</code>(SPM 分发)</td><td>v0.9.1 / v1.0</td></tr>
          <tr><td>Kotlin</td><td><code>androidx.a2ui</code>(Google Maven:a2ui-model、a2ui-engine)</td><td>v0.9.1</td></tr>
        </tbody>
      </table>

      <h2 id="agent">Agent SDK</h2>
      <p>智能体侧库:目录裁剪(transformer)、能力协商、提示词生成、推理格式编译、
      对照 RendererState 的有状态校验。</p>
      <table>
        <thead><tr><th scope="col">语言</th><th scope="col">包</th><th scope="col">协议版本</th></tr></thead>
        <tbody>
          <tr><td>TypeScript</td><td><code>@a2ui/agent</code></td><td>v0.9.1 / v1.0</td></tr>
          <tr><td>Python</td><td><code>a2ui-agent-sdk</code>,另有 <code>a2ui-adk</code>(ADK)、<code>a2ui-a2a</code>(A2A)</td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Dart</td><td><code>a2ui_agent</code></td><td>v0.9.1 / v1.0</td></tr>
        </tbody>
      </table>
      <p>Swift 与 Kotlin 面向客户端渲染,不做服务端生成;旧 JVM 服务端实现保留在仓库
      <code>kotlin/agent_sdk_legacy</code>。用法见<a routerLink="/docs/agent-sdk">Agent 集成</a>。</p>

      <h2 id="renderer">Renderer SDK(框架适配器)</h2>
      <p>每个适配器内置基础目录实现,把无障碍属性映射到平台 API,并支持自定义组件与本地函数:</p>
      <table>
        <thead><tr><th scope="col">框架</th><th scope="col">包</th><th scope="col">协议版本</th></tr></thead>
        <tbody>
          <tr><td>Flutter</td><td><code>a2ui_flutter</code></td><td>v0.9.1 / v1.0</td></tr>
          <tr><td>React</td><td><code>@a2ui/react</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Lit</td><td><code>@a2ui/lit</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Angular</td><td><code>@a2ui/angular</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>SwiftUI</td><td><code>A2UISwiftUI</code>、<code>BasicCatalogSwiftUI</code></td><td>v0.9.1 / v1.0</td></tr>
          <tr><td>Jetpack Compose</td><td><code>androidx.a2ui.compose</code>、<code>material3-a2ui</code></td><td>v0.9.1</td></tr>
        </tbody>
      </table>
      <p>本站的 Playground 同时驱动 <code>@a2ui/angular</code> 与 <code>@a2ui/react</code> 两个适配器,
      集成步骤见<a routerLink="/docs/renderers">客户端集成</a>。</p>

      <h2 id="extras">Web 扩展包</h2>
      <ul>
        <li><code>@a2ui/markdown-it</code>:Text 组件的 Markdown 渲染实现。</li>
        <li><code>@a2ui/catalog-mcp</code>:MCP 目录——callMcpTool、数据变换函数与沙箱化的 McpApp 组件,
          见<a routerLink="/docs/mcp">MCP 集成</a>。</li>
      </ul>

      <h2 id="community">社区 SDK</h2>
      <p>Go 与终端渲染由社区维护:<code>satorunooshie/a2ui-go</code>、<code>tmc/a2ui</code>、
      <code>charmbracelet/a2tea</code>、<code>muncus/a2term</code>,覆盖服务端校验、流式解析与终端 UI。</p>

      <h2 id="conformance">一致性套件</h2>
      <p>协议行为用语言无关的 YAML 用例锁定:<code>blueprints/modules</code> 定义模块蓝图,
      <code>conformance/core</code> 与 <code>conformance/agent</code> 分别是 Core 与 Agent 的测试套件。
      任何语言的实现跑同一套用例,保证「两边理解一致」不靠口头约定。包列表与版本矩阵见
      <a href="https://a2ui.org/concepts/sdks/" target="_blank" rel="noopener">官方 SDKs 文档</a>。</p>
    </div>
  `,
})
export class SdksPage {}