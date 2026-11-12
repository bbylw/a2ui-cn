import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-mcp-render',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="指南" heading="在 MCP App 中渲染 A2UI">
        外层宿主（Claude Desktop、Cursor、VS Code）支持 MCP Apps 但不原生支持 A2UI 时，
        把 A2UI Web 渲染器打包进 ui:// HTML 资源：宿主无需任何 A2UI 代码，就能显示交互 surface。
        这是<a routerLink="/docs/mcp-apps">嵌入 MCP Apps</a>的反方向。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="flow">端到端流程</h2>
      <ul>
        <li>服务器发布自包含 HTML 包（<code>ui://</code>，MIME <code>text/html;profile=mcp-app</code>），
          以及入口工具与返回 <code>application/a2ui+json</code> 消息的回调工具。</li>
        <li>宿主调入口工具，按 _meta.ui.resourceUri 读 HTML，经沙箱代理注入内层 srcdoc iframe。</li>
        <li>内嵌应用自带 MessageProcessor + 目录 + <code>&lt;a2ui-surface&gt;</code>，
          把工具结果里的 A2UI 消息喂进去渲染；用户动作转成 JSON-RPC tools/call 经宿主回服务器，
          服务器返回 updateDataModel 原地刷新。</li>
      </ul>
      <p><code>_meta.ui.visibility</code> 划分工具可见性：入口工具 <code>["model"]</code>
      给模型一个启动器；交互工具 <code>["app"]</code> 只供沙箱视图调用，不挤占模型工具列表。</p>

      <h2 id="server">服务器：注册资源与工具</h2>
      <app-code lang="ts" label="入口工具返回初始 surface，交互工具只返回数据（节选）" [code]="serverTs" />

      <h2 id="app">内嵌应用：渲染器 + 动作转发</h2>
      <p>安装 <code>@a2ui/lit @a2ui/markdown-it @a2ui/web_core lit @modelcontextprotocol/ext-apps</code>。
      核心是把每个 A2UI action 转成 callServerTool，再把结果喂回处理器：</p>
      <app-code lang="ts" label="src/main.ts（v1.0）" [code]="mainTs" />
      <p>需要全量表单状态时，在回调里读
      <code>processor.getSurface(action.surfaceId)?.dataModel.get('/')</code> 合并进 arguments。
      不用 ext-apps 也可以直接写 window.parent.postMessage 的 JSON-RPC 协议；
      手写 message 监听时校验 <code>event.source === window.parent</code> 并显式指定 target origin。</p>

      <h2 id="bundle">打包成单文件 HTML</h2>
      <p>srcdoc iframe 没有 base URL，外部 script/link 与代码分割 chunk 都解析不了。
      必须产出一个自包含 HTML：</p>
      <ul>
        <li><strong>Vite（Lit/React）。</strong>vite-plugin-singlefile 一键内联。</li>
        <li><strong>Angular。</strong>ng build 后用 esbuild 把 main.js 打包成单 ESM 文件，
          内联 script/style 进 index.html，剥掉 modulepreload 链接
          （参考官方示例的 inline.js）。</li>
      </ul>
      <app-code lang="ts" label="vite.config.ts" [code]="viteTs" />

      <h2 id="constraints">沙箱约束与主题</h2>
      <ul>
        <li>opaque origin 下 storage/cookie 抛 SecurityError：临时状态放数据模型，持久状态放服务器。</li>
        <li>外部媒体/字体默认被 CSP 挡：在 resources/read 返回项的 _meta.ui.csp 里声明域名。</li>
        <li>主题同步：启动时与 ui/notifications/host-context-changed 时，按宿主 theme 切换
          <code>.a2ui-light</code>/<code>.a2ui-dark</code> 根类；基础目录样式用 <code>light-dark()</code> 令牌，
          也可覆盖 <code>--a2ui-color-primary</code> 等变量。</li>
        <li>返回工具结果前用 validatePayload 在服务端校验——坏消息会在沙箱里才失败，排查更贵。</li>
      </ul>
      <p>官方示例 <code>samples/community/mcp/a2ui-in-mcpapps</code> 含生成式编辑器与计数器两个微应用，
      完整步骤见 <a href="https://a2ui.org/guides/a2ui-in-mcp-apps/" target="_blank" rel="noopener">官方 Render A2UI Inside an MCP App 指南</a>。</p>
    </div>
  `,
})
export class McpRenderPage {
  protected readonly serverTs = `registerAppTool(
  server,
  'open_counter_app',
  {
    title: 'Open Counter App',
    inputSchema: {},
    _meta: {ui: {resourceUri: APP_URI, visibility: ['model']}},
  },
  async () => ({
    content: [
      {type: 'text', text: \`Counter opened at \${count}.\`},
      {type: 'resource', resource: {
        uri: 'a2ui://counter-card',
        mimeType: 'application/a2ui+json',
        text: JSON.stringify(buildInitialSurfacePayload(count)),
      }},
    ],
  }),
);

server.registerTool(
  'increase_counter',
  {
    title: 'Increase Counter',
    inputSchema: {step: z.number().int().default(1)},
    _meta: {ui: {visibility: ['app']}},
  },
  async ({step}) => {
    count += step;
    return {
      content: [{type: 'resource', resource: {
        uri: 'a2ui://counter-card/data',
        mimeType: 'application/a2ui+json',
        text: JSON.stringify([{
          version: '1.0',
          updateDataModel: {surfaceId: 'counter_card', path: '/count', value: count},
        }]),
      }}],
    };
  },
);`;

  protected readonly mainTs = `import {html, render} from 'lit';
import '@a2ui/lit';
import {renderMarkdown} from '@a2ui/markdown-it';
import {
  basicCatalog, MessageProcessor, setMarkdownRenderer,
  type ProcessableMessagePayload,
} from '@a2ui/web_core/v1_0';
import {App} from '@modelcontextprotocol/ext-apps';
import type {CallToolResult} from '@modelcontextprotocol/sdk/types.js';

setMarkdownRenderer(renderMarkdown);
const A2UI_MIME_TYPE = 'application/a2ui+json';
const rootEl = document.getElementById('surface-root')!;

const app = new App(
  {name: 'counter-mcp-app', version: '1.0.0'},
  {availableDisplayModes: ['inline']},
  {autoResize: true},
);

function applyToolResult(result: CallToolResult): void {
  for (const block of result.content ?? []) {
    if (block.type === 'resource' && 'text' in block.resource
        && block.resource.mimeType === A2UI_MIME_TYPE) {
      processor.processMessages(JSON.parse(block.resource.text) as ProcessableMessagePayload);
    }
  }
}

const processor = new MessageProcessor([basicCatalog], async action => {
  const result = await app.callServerTool({name: action.name, arguments: action.context});
  applyToolResult(result);
});

processor.onSurfaceCreated(surface => {
  render(html\`<a2ui-surface .surface=\${surface}></a2ui-surface>\`, rootEl);
});

app.ontoolresult = params => applyToolResult(params);
await app.connect();`;

  protected readonly viteTs = `import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {outDir: 'dist', emptyOutDir: true},
});`;
}