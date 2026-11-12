import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-mcp',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="指南" heading="MCP 集成总览">
        A2UI 与 Model Context Protocol 有四种集成方式，取决于两件事:
        外层宿主是你的应用还是外部 MCP 客户端；MCP 服务器返回的是 JSON、可复用的 A2UI 布局，还是沙箱化 HTML 应用。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="patterns">四种模式</h2>
      <table>
        <thead><tr><th scope="col">模式</th><th scope="col">外层宿主</th><th scope="col">服务器输出</th><th scope="col">指南</th></tr></thead>
        <tbody>
          <tr>
            <td>从 A2UI 输入与按钮调用无头 MCP 工具</td>
            <td>你的 A2UI Web 应用</td>
            <td>JSON / 文本工具结果</td>
            <td><a routerLink="/docs/mcp-tools">调用 MCP 工具</a></td>
          </tr>
          <tr>
            <td>工具返回可复用 A2UI 布局与每次调用的数据</td>
            <td>你的 A2UI Web 应用</td>
            <td><code>a2ui://</code> 模板(application/a2ui+json)</td>
            <td><a routerLink="/docs/mcp-layouts">提供 A2UI 布局</a></td>
          </tr>
          <tr>
            <td>在 A2UI surface 里嵌入第三方交互 HTML 组件</td>
            <td>你的 A2UI Web 应用</td>
            <td><code>ui://</code> HTML 应用(text/html;profile=mcp-app)</td>
            <td><a routerLink="/docs/mcp-apps">嵌入 MCP Apps</a></td>
          </tr>
          <tr>
            <td>在 Claude Desktop、Cursor、VS Code 里显示 A2UI surface</td>
            <td>外部 MCP Apps 宿主</td>
            <td>内含 A2UI 渲染器的 <code>ui://</code> HTML 包</td>
            <td><a routerLink="/docs/mcp-render">在 MCP App 中渲染</a></td>
          </tr>
        </tbody>
      </table>

      <h2 id="fit">它们如何配合</h2>
      <p><strong>你拥有 Web 应用时：</strong><code>@a2ui/catalog-mcp</code> 把 Lit/React/Angular 渲染器
      直接连到 MCP Client 会话。surface 可以用 <code>callMcpTool</code> 调工具、把返回 JSON 写进数据模型
      (模式一);也可以用 <code>McpApp</code> 把第三方 <code>ui://</code> HTML 组件 mount 进双层 iframe 沙箱(模式三)。</p>
      <p><strong>MCP 服务器发出 A2UI 消息时：</strong>服务器把声明式布局发布为 <code>a2ui://</code> 资源,
      <code>tools/call</code> 只返回紧凑的 <code>updateDataModel</code>(模式二)。
      若外层客户端只支持 MCP Apps 而不原生支持 A2UI，就把 A2UI Web 渲染器打包进 <code>ui://</code> HTML 包本身(模式四)。</p>

      <h2 id="pick">怎么选</h2>
      <ul>
        <li>两侧都原生支持 A2UI、不想要 iframe:模式一 + 模式二。</li>
        <li>你的 A2UI 应用要展示第三方 HTML 组件(看板、3D 画布):模式三。</li>
        <li>你的用户在不支持 A2UI 的 MCP 宿主里：模式四。</li>
      </ul>
      <p>四种模式共用同一套消息与目录机制，可以组合使用。官方总览见
      <a href="https://a2ui.org/guides/mcp-overview/" target="_blank" rel="noopener">a2ui.org/guides/mcp-overview</a>。</p>
    </div>
  `,
})
export class McpPage {}