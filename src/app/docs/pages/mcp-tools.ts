import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-mcp-tools',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="指南" heading="从 A2UI 调用 MCP 工具">
        @a2ui/catalog-mcp 把 A2UI v1.0 Web surface 连到 MCP 服务器：按钮与输入直接调工具，
        把 JSON 或文本结果写进 surface 数据模型，不需要再绕一轮智能体。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="setup">接线</h2>
      <p>安装 <code>@a2ui/catalog-mcp @a2ui/web_core lit @modelcontextprotocol/sdk</code>，
      连接 MCP Client，注册基础目录 + mcpCatalog，再 configureMcpCatalog：</p>
      <app-code lang="ts" label="连接客户端并注册目录" [code]="setupTs" />
      <p>React 用 <code>MessageProcessor&lt;ReactCatalogComponent&gt;</code>；Angular 把 mcpCatalog 包进
      AngularCatalog，在环境初始化器里调 configureMcpCatalog，processor 取自
      <code>inject(A2uiRendererService).processor</code>。
      同时把目录 ID <code>https://a2ui.org/specification/v1_0/catalogs/mcp/catalog.json</code>
      加进智能体的 supportedCatalogIds，并把 catalog.json 喂进提示词与校验。</p>

      <h2 id="call">callMcpTool：结果写进数据路径</h2>
      <app-code lang="json" label="调用工具并写入 /issueResponse" [code]="callJson" />
      <p>组件随后绑定 <code>/issueResponse/structuredContent/issues</code>、<code>/issueResponse/json</code>
      或 <code>/issueResponse/text</code>。响应字段：structuredContent（服务器结构化对象）、
      json（解析后的文本 JSON）、text（文本块拼接）、toolName/toolInput/toolResult（原始结果）。
      调用失败或 isError 抛 A2uiExpressionError，数据模型保持不动。</p>
      <p><strong>并发护栏：</strong>同一 targetDataPath 上的快速连续输入，只有最新一次调用会写回，
      旧响应被丢弃。独立功能用独立路径。</p>

      <h2 id="reshape">变换与重塑 JSON</h2>
      <p>四个内置函数可以链式组合：callMcpTool 取数 → transformData（JMESPath）过滤重塑 →
      updateDataModel 写路径：</p>
      <table>
        <thead><tr><th scope="col">函数</th><th scope="col">参数</th><th scope="col">行为</th></tr></thead>
        <tbody>
          <tr><td>transformData</td><td>jmespath、data</td><td>标准 JMESPath 求值，缺失字段得 null</td></tr>
          <tr><td>updateDataModel</td><td>updates</td><td>写 &#123;path: value&#125; 对，/ 开头绝对、其余相对</td></tr>
          <tr><td>split</td><td>value、separator</td><td>按字面分隔符切字符串；"" 切成码点</td></tr>
          <tr><td>regexCapture</td><td>value、pattern</td><td>首个匹配的捕获组；可选组未匹配得空串</td></tr>
        </tbody>
      </table>
      <app-code lang="json" label="链式调用：取数 → JMESPath → 写 /issues（节选）" [code]="chainJson" />
      <p>纯文本输出可以用 split + regexCapture 解析成记录。regexCapture 只接受 ECMAScript Unicode
      模式语法：无 flags、无 lookahead/lookbehind、无反向引用，灾难性回溯模式被拒绝（与基础目录 regex 同一检查）。</p>

      <h2 id="advanced">进阶配置</h2>
      <ul>
        <li><strong>多服务器路由。</strong>getMcpClientForTool 按工具名返回对应 Client；
          启动时用 listTools（） 建映射。</li>
        <li><strong>部分注册。</strong>mcpCatalog.withEntries 只挑需要的函数实现，
          比如只要 CallMcpToolImplementation。</li>
        <li><strong>自定义解析器。</strong>用 createFunctionImplementation 在自己的目录里加
          parseCsv 之类函数，payload 里用你的 catalogId 引用。</li>
        <li><strong>沙箱路径。</strong>configureMcpCatalog（&#123;sandbox：&#123;baseUrl&#125;&#125;）
          改 McpApp 沙箱文件的托管位置，见<a routerLink="/docs/mcp-apps">嵌入 MCP Apps</a>。</li>
      </ul>
      <p><strong>排障：</strong>lit / @a2ui/web_core 出现重复副本会破坏元素注册与 Catalog 检查。
      跑 npm dedupe、查 npm ls，Vite 里加 <code>resolve: &#123;dedupe: ['lit', '@a2ui/web_core']&#125;</code>。
      完整函数 schema 见
      <a href="https://a2ui.org/guides/mcp-catalog/" target="_blank" rel="noopener">官方 Call MCP Tools 指南</a>。</p>
    </div>
  `,
})
export class McpToolsPage {
  protected readonly setupTs = `import {configureMcpCatalog, mcpCatalog} from '@a2ui/catalog-mcp';
import {basicCatalog, MessageProcessor} from '@a2ui/web_core/v1_0';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const mcpClient = new Client({name: 'my-web-app', version: '1.0.0'});
await mcpClient.connect(
  new StreamableHTTPClientTransport(new URL('http://localhost:8000/mcp')),
);

const processor = new MessageProcessor([basicCatalog, mcpCatalog], action => {
  console.log('Action dispatched:', action);
});

configureMcpCatalog({
  getMcpClientForTool: () => mcpClient,
  processor,
});`;

  protected readonly callJson = `{
  "@call": "callMcpTool",
  "catalogId": "https://a2ui.org/specification/v1_0/catalogs/mcp/catalog.json",
  "args": {
    "name": "list_issues",
    "arguments": {"repository": {"@path": "/repository"}},
    "targetDataPath": "/issueResponse"
  }
}`;

  protected readonly chainJson = `{
  "@call": "updateDataModel",
  "catalogId": "https://a2ui.org/specification/v1_0/catalogs/mcp/catalog.json",
  "args": {
    "updates": {
      "@call": "transformData",
      "catalogId": "https://a2ui.org/specification/v1_0/catalogs/mcp/catalog.json",
      "args": {
        "jmespath": "{\\"/issues\\": json[?state == 'open'].{number: to_string(number), title: title}}",
        "data": {
          "@call": "callMcpTool",
          "catalogId": "https://a2ui.org/specification/v1_0/catalogs/mcp/catalog.json",
          "args": {
            "name": "list_issues",
            "arguments": {"repository": {"@path": "/repository"}}
          }
        }
      }
    }
  }
}`;
}