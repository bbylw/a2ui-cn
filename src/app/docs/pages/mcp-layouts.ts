import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-mcp-layouts',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="指南 / 提供 A2UI 布局" heading="从 MCP 服务器提供 A2UI 布局">
        布局只发一次,数据每次发:服务器把静态组件树发布为 a2ui:// 资源,
        tools/call 只返回 updateDataModel。客户端按 URI 缓存模板,工具运行时刷新 surface 状态。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="architecture">模板与数据分离</h2>
      <ul>
        <li><strong>resources/read。</strong>发布 <code>a2ui://</code> 资源,MIME 为
          <code>application/a2ui+json</code>,内容是 createSurface + updateComponents;
          组件属性绑定 JSON Pointer 而非硬编码值。</li>
        <li><strong>_meta.ui。</strong>工具描述符或 CallToolResult 上用
          <code>resourceUri</code> + <code>mimeType</code> 关联布局;结果上的 URI 覆盖描述符默认值。</li>
        <li><strong>tools/call。</strong>计算当前值,返回 EmbeddedResource(updateDataModel)
          加一条 TextContent 摘要,照顾纯文本宿主。</li>
        <li><strong>客户端水合。</strong>解析 resourceUri,缓存未命中才 resources/read;
          surface 未创建则初始化,然后应用 updateDataModel。</li>
      </ul>

      <h2 id="template">第一步:发布布局资源</h2>
      <app-code lang="json" label="a2ui://recipe-card 模板(v1.0)" [code]="templateJson" />
      <app-code lang="ts" label="TypeScript:注册资源" [code]="resourceTs" />

      <h2 id="tool">第二步:工具返回 updateDataModel</h2>
      <app-code lang="ts" label="registerTool:_meta.ui 关联模板,结果只带数据" [code]="toolTs" />
      <p>Python 用 mcp 1.x 低级 Server 装饰器(list_resources/read_resource/list_tools/call_tool)
      做同样的事;注意示例需要 <code>mcp&lt;2</code>。</p>

      <h2 id="client">第三步:客户端水合</h2>
      <p>用 <code>@a2ui/catalog-mcp</code> 时,callMcpTool 自动完成模板发现、URI 缓存与消息转发
      (configureMcpCatalog 传入 processor 即可,见<a routerLink="/docs/mcp-tools">调用 MCP 工具</a>)。
      surface 上的按钮这样触发工具:</p>
      <app-code lang="json" label="Button 的 functionCall 调工具" [code]="buttonJson" />
      <p>surface 已活跃时跳过 createSurface,模板只在缓存未命中时拉取。</p>

      <h2 id="production">生产实践</h2>
      <ul>
        <li><strong>服务端先校验。</strong>validatePayload(TS)/ validate_payload(Python/Dart)
          按渲染器同样的规则检查 schema、属性与树拓扑,坏消息在服务器就被拦下。</li>
        <li><strong>控制 LLM 上下文。</strong>EmbeddedResource 的 annotations.audience 设
          <code>["user"]</code>:界面照常渲染,原始 A2UI JSON 不进模型上下文;
          <code>["assistant"]</code> 则相反;省略则两侧都可见。</li>
      </ul>

      <h2 id="bidirectional">MCP 作为唯一传输</h2>
      <p>没有独立 A2A/AG-UI 通道时,客户端在 initialize 握手的
      <code>params.capabilities.a2ui</code>(有状态)或每次 tools/call 的
      <code>params._meta.a2ui</code>(无状态)里上报 supportedCatalogIds;
      事件与错误经两个约定工具回传:</p>
      <ul>
        <li><code>a2ui_action</code>:inputSchema 必须声明全部五个字段
          (name、surfaceId、sourceComponentId、timestamp、context),否则做 schema 校验的 MCP SDK 会把它们剥掉。</li>
        <li><code>a2ui_error</code>:转发 VALIDATION_FAILED 等校验错误与运行时表达式错误。</li>
      </ul>
      <p>版本差异提醒:v0.9.1 用 <code>path</code>/<code>call</code>、连字符组件 id、
      <code>"version": "v0.9"</code>,且单 surface 单目录——需要把 CallMcpToolImplementation
      组合进 '0.9' Catalog 并设 defaultVersion。完整握手与示例见
      <a href="https://a2ui.org/guides/a2ui-over-mcp/" target="_blank" rel="noopener">官方 Serve A2UI Layouts 指南</a>。</p>
    </div>
  `,
})
export class McpLayoutsPage {
  protected readonly templateJson = `[
  {
    "version": "1.0",
    "createSurface": {
      "surfaceId": "recipe-card",
      "catalogId": "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json"
    }
  },
  {
    "version": "1.0",
    "updateComponents": {
      "surfaceId": "recipe-card",
      "components": [
        {"id": "root", "component": "Card", "child": "main_column"},
        {"id": "main_column", "component": "Column", "children": ["recipe_title", "cook_time"]},
        {"id": "recipe_title", "component": "Text", "text": {"@path": "/title"}},
        {"id": "cook_time", "component": "Text", "text": {"@path": "/cookTime"}, "variant": "caption"}
      ]
    }
  }
]`;

  protected readonly resourceTs = `import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';

const A2UI_MIME_TYPE = 'application/a2ui+json';
const RECIPE_CARD_URI = 'a2ui://recipe-card';

const server = new McpServer({name: 'recipe-server', version: '1.0.0'});

server.registerResource(
  'Recipe Card',
  RECIPE_CARD_URI,
  {description: 'Static A2UI recipe card layout template.', mimeType: A2UI_MIME_TYPE},
  async () => ({
    contents: [{
      uri: RECIPE_CARD_URI,
      mimeType: A2UI_MIME_TYPE,
      text: JSON.stringify(recipeCardTemplate),
    }],
  }),
);`;

  protected readonly toolTs = `server.registerTool(
  'get_recipe_a2ui',
  {
    title: 'Get Recipe A2UI',
    description: 'Returns recipe data and links to the recipe-card template.',
    inputSchema: {cookingStyle: z.array(z.string()).optional()},
    _meta: {ui: {resourceUri: RECIPE_CARD_URI, mimeType: A2UI_MIME_TYPE}},
  },
  async ({cookingStyle}) => {
    const recipe = lookupRecipe(cookingStyle?.[0] ?? 'Baked');
    const dataModelUpdate = [{
      version: '1.0',
      updateDataModel: {
        surfaceId: 'recipe-card',
        path: '/',
        value: {title: recipe.title, cookTime: recipe.cookTime},
      },
    }];
    return {
      content: [
        {type: 'text', text: \`Generated recipe: \${recipe.title}\`},
        {type: 'resource', resource: {
          uri: \`\${RECIPE_CARD_URI}/data\`,
          mimeType: A2UI_MIME_TYPE,
          text: JSON.stringify(dataModelUpdate),
        }},
      ],
      _meta: {ui: {resourceUri: RECIPE_CARD_URI, mimeType: A2UI_MIME_TYPE}},
    };
  },
);`;

  protected readonly buttonJson = `{
  "id": "submit_button",
  "component": "Button",
  "child": "submit_button_text",
  "variant": "primary",
  "action": {
    "functionCall": {
      "@call": "callMcpTool",
      "catalogId": "https://a2ui.org/specification/v1_0/catalogs/mcp/catalog.json",
      "args": {
        "name": "get_recipe_a2ui",
        "arguments": {"cookingStyle": {"@path": "/cookingStyle"}}
      }
    }
  }
}`;
}