import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-mcp-apps',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="指南" heading="在 A2UI 中嵌入 MCP Apps">
        McpApp 组件把第三方交互 HTML 组件(拖拽看板、3D 画布)放进 A2UI surface,
        在双层 iframe 沙箱里运行，并把它的状态与工具调用和周围的原生组件同步起来。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="sandbox">先部署沙箱文件</h2>
      <p>McpApp 从你应用同源的 <code>/a2ui-sandbox/</code> 加载外层沙箱中继。
      把 <code>node_modules/@a2ui/catalog-mcp/sandbox</code> serve 到该路径。Angular CLI 在
      angular.json 的 assets 里加：</p>
      <app-code lang="json" label="angular.json assets 条目" [code]="assetsJson" />
      <p>Vite 用 vite-plugin-static-copy 或拷进 public/a2ui-sandbox/;静态服务器直接复制目录。
      前提是先按<a routerLink="/docs/mcp-tools">调用 MCP 工具</a>完成 configureMcpCatalog。</p>

      <h2 id="component">放上 McpApp 组件</h2>
      <app-code lang="json" label="surface 上的 McpApp" [code]="appJson" />
      <table>
        <thead><tr><th scope="col">属性</th><th scope="col">必填</th><th scope="col">用途</th></tr></thead>
        <tbody>
          <tr><td>htmlContent</td><td>是</td><td>应用的 HTML 文档；url_encoded: 前缀先解码</td></tr>
          <tr><td>title</td><td>否</td><td>iframe 无障碍标题</td></tr>
          <tr><td>data.paths</td><td>否</td><td>应用内状态键(含保留 toolInput/toolResult/modelContext)到数据模型路径的双向映射</td></tr>
          <tr><td>allowedTools</td><td>否</td><td>允许调用的 MCP 工具名，其余拒绝</td></tr>
          <tr><td>allowedFunctions</td><td>否</td><td>允许调用的 A2UI 函数名到参数 schema 的映射</td></tr>
          <tr><td>csp / permissions</td><td>否</td><td>域名白名单与浏览器能力，来自 _meta.ui</td></tr>
        </tbody>
      </table>
      <p>callMcpTool 的结果若带 ui:// 资源，会附上 resourceUri/html/csp/permissions 字段,
      可以直接绑定到 McpApp 的属性上。</p>

      <h2 id="isolation">双层 iframe 沙箱</h2>
      <p>单层 iframe 同时给 allow-scripts 与 allow-same-origin 是危险的：脚本会共享你的 origin。
      McpApp 改为嵌套两层：</p>
      <ul>
        <li><strong>外层代理帧。</strong>加载同源 sandbox.html，校验消息 origin，把不可信 HTML 注入内层 srcdoc。</li>
        <li><strong>内层帧。</strong>只有 <code>sandbox="allow-scripts"</code>，没有 allow-same-origin,
          浏览器给它唯一的 opaque origin(null):读不到你的 DOM、cookie、storage;
          也没有 top-navigation/popups/forms/modals 权限。</li>
      </ul>
      <p>因此组件内 localStorage/IndexedDB/cookie 会抛 SecurityError——持久化走服务器 tools/call,
      临时状态走 data.paths；外部网络与媒体默认被 CSP 挡，域名要列进 _meta.ui.csp。</p>

      <h2 id="sync">四条同步通道</h2>
      <ul>
        <li><strong>双向数据。</strong>surface 侧变化发 ui/notifications/data-model-update 进组件;
          组件的 data-model-change 写回绑定路径，兄弟组件立即刷新。</li>
        <li><strong>工具直连。</strong>allowedTools 内的 tools/call 由浏览器 MCP Client 直接执行;
          没有浏览器客户端时，转发为以工具名命名的 A2UI action，交给后端代理智能体。</li>
        <li><strong>本地函数。</strong>allowedFunctions 声明的函数在本地校验并执行。</li>
        <li><strong>智能体上下文。</strong>ui/update-model-context 把选择/过滤状态写进 modelContext 路径;
          ui/message 派发 a2ui.mcpAppMessage action，宿主可转成给智能体的提示。</li>
      </ul>

      <h2 id="styling">样式与排障</h2>
      <p>框体初始 500px 高、随组件报告的内容尺寸自动调整；用
      <code>--a2ui-sandboxed-frame-height/border/border-radius/background</code> 自定义。
      空白框/404 先查 /a2ui-sandbox/ 是否同源 serve；被拒绝的调用查控制台警告,
      核对 allowedTools/allowedFunctions。官方 Kanban 示例
      (<code>samples/community/mcp/a2ui-kanban</code>)完整演示了拖拽卡片同步兄弟组件计数、
      快速添加栏零智能体回合调工具等流程，见
      <a href="https://a2ui.org/guides/mcp-apps-in-a2ui/" target="_blank" rel="noopener">官方 Embed MCP Apps 指南</a>。</p>
    </div>
  `,
})
export class McpAppsPage {
  protected readonly assetsJson = `{
  "glob": "**/*",
  "input": "node_modules/@a2ui/catalog-mcp/sandbox",
  "output": "a2ui-sandbox"
}`;

  protected readonly appJson = `{
  "id": "scene3d_app",
  "component": "McpApp",
  "@catalogId": "https://a2ui.org/specification/v1_0/catalogs/mcp/catalog.json",
  "title": "3D Holographic Geometry Studio",
  "allowedTools": ["capture_3d_snapshot"],
  "data": {
    "paths": {
      "scene3d": "/scene3d",
      "modelContext": "/scene3d/modelContext"
    }
  },
  "htmlContent": "<!doctype html><html><body>...</body></html>"
}`;
}