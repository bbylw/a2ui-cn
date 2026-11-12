import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-catalogs',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="概念" heading="目录">
        目录（Catalog）是智能体与渲染器之间的白名单契约：一份带版本号的 JSON Schema，
        声明可用的组件、函数与给模型的 instructions。你决定目录里有什么，智能体决定从中画什么。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="contract">目录的结构</h2>
      <p>每份目录文档包含四个部分：</p>
      <ul>
        <li><strong>catalogId。</strong>全局唯一标识，惯例是一个 URI，例如官方基础目录的
          <code>https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json</code>。消息与能力协商都靠它引用目录。</li>
        <li><strong>components。</strong>组件名到 JSON Schema 的映射。schema 描述属性类型、必填项与放置规则，
          动态属性用 <code>$ref</code> 指向 <code>common_types.json</code> 里的 DynamicString、DynamicNumber、ChildList 等类型。</li>
        <li><strong>functions。</strong>函数名到 schema 的映射，声明参数、<code>returnType</code> 与调用权限。</li>
        <li><strong>instructions。</strong>Markdown 文本，目录激活时附加进模型的系统提示，告诉模型这些组件该怎么用。</li>
      </ul>
      <p>一个业务组件的 schema 长这样：</p>
      <app-code lang="json" label="FlightStatusCard 组件 schema（v1.0）" [code]="flightSchema" />
      <p><code>allowedParents</code> 限制它只能放在 Column、List 里；渲染器在解析时做同样的检查，
      放错位置会回 <code>UNALLOWED_PARENT</code> 错误。函数的 schema 同样声明参数与返回类型：</p>
      <app-code lang="json" label="formatCurrency 函数 schema（v1.0）" [code]="currencySchema" />

      <h2 id="basic">官方基础目录</h2>
      <p>基础目录（Basic Catalog）是可选的通用参考目录，提供 18 个组件与 15 个函数，
      各框架适配器都内置了它的实现：</p>
      <table>
        <thead><tr><th scope="col">类别</th><th scope="col">组件</th></tr></thead>
        <tbody>
          <tr><td>布局</td><td>Row、Column、List、Card、Tabs、Modal、Divider</td></tr>
          <tr><td>内容</td><td>Text、Image、Icon、Video、AudioPlayer</td></tr>
          <tr><td>输入</td><td>Button、TextField、CheckBox、ChoicePicker、Slider、DateTimeInput</td></tr>
        </tbody>
      </table>
      <table>
        <thead><tr><th scope="col">类别</th><th scope="col">函数</th></tr></thead>
        <tbody>
          <tr><td>模板迭代</td><td><code>@index</code>（v1.0 新增）</td></tr>
          <tr><td>校验</td><td>required、regex、length、numeric、email</td></tr>
          <tr><td>格式化</td><td>formatString、formatNumber、formatCurrency、formatDate、pluralize</td></tr>
          <tr><td>逻辑与导航</td><td>and、or、not、openUrl</td></tr>
        </tbody>
      </table>
      <p>业务组件（航班卡片、图表、地图）通过自定义目录加入。编写方法见<a routerLink="/docs/define-catalog">定义目录</a>，
      跨框架复用的写法见<a routerLink="/docs/universal">通用 Web 组件</a>。</p>

      <h2 id="mixing">一个 surface 混用多个目录</h2>
      <p>v1.0 里 <code>createSurface.catalogId</code> 指定 surface 的默认目录，
      单个组件可以用 <code>@catalogId</code> 覆盖，把基础目录的布局组件与自定义目录的业务组件画在同一块界面里：</p>
      <app-code lang="json" label="默认目录 + 逐组件 @catalogId" [code]="mixingJson" />
      <p>v0.9.1 没有逐组件覆盖：一个 surface 绑定一个目录，混用需要把组件合并进同一份目录定义。</p>

      <h2 id="negotiation">能力协商</h2>
      <p>会话开始时，渲染器通过传输层的握手 metadata（不是 A2UI 消息）上报
      <code>supportedCatalogIds</code>，列出自己实现了哪些目录；智能体只能从这份清单里挑选
      <code>createSurface</code> 的目录。渲染器没注册的组件一律拒绝渲染——这是 A2UI 的核心安全护栏。</p>
      <p>智能体侧用 <code>CatalogConfig</code> 加载目录，交给 <code>A2uiGenerator</code> 生成提示词与做服务端校验：</p>
      <app-code lang="ts" label="Agent SDK 加载目录（TypeScript）" [code]="agentLoadTs" />
      <p>渲染侧的注册方式因框架而异，见<a routerLink="/docs/renderers">客户端集成</a>与
      <a routerLink="/docs/define-catalog">定义目录</a>指南。完整字段定义见
      <a href="https://a2ui.org/concepts/catalogs/" target="_blank" rel="noopener">官方 Catalogs 文档</a>。</p>
    </div>
  `,
})
export class CatalogsPage {
  protected readonly flightSchema = `{
  "FlightStatusCard": {
    "type": "object",
    "description": "Shows a flight's number, fare, and action buttons.",
    "allowedParents": ["Column", "List"],
    "properties": {
      "component": {"const": "FlightStatusCard"},
      "flightNumber": {
        "$ref": "common_types.json#/$defs/DynamicString",
        "description": "IATA flight designator, such as 'NH 105'."
      },
      "fareAmount": {
        "$ref": "common_types.json#/$defs/DynamicNumber",
        "description": "Ticket fare in the booking currency."
      },
      "actions": {
        "$ref": "common_types.json#/$defs/ChildList",
        "description": "Buttons shown in the card footer."
      }
    },
    "required": ["component", "flightNumber"]
  }
}`;

  protected readonly currencySchema = `{
  "formatCurrency": {
    "type": "object",
    "description": "Formats a number as a currency string.",
    "returnType": "string",
    "properties": {
      "@call": {"const": "formatCurrency"},
      "args": {
        "type": "object",
        "properties": {
          "value": {
            "$ref": "common_types.json#/$defs/DynamicNumber",
            "description": "The monetary amount."
          },
          "currency": {
            "$ref": "common_types.json#/$defs/DynamicString",
            "description": "The ISO 4217 currency code (e.g., 'USD', 'EUR')."
          }
        },
        "required": ["currency", "value"],
        "unevaluatedProperties": false
      }
    },
    "required": ["@call", "args"]
  }
}`;

  protected readonly mixingJson = `[
  {
    "version": "1.0",
    "createSurface": {
      "surfaceId": "salesDashboard",
      "catalogId": "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json"
    }
  },
  {
    "version": "1.0",
    "updateComponents": {
      "surfaceId": "salesDashboard",
      "components": [
        {"id": "root", "component": "Column", "children": ["title", "chart"]},
        {"id": "title", "component": "Text", "text": "Quarterly sales"},
        {
          "id": "chart",
          "component": "BarChart",
          "@catalogId": "https://example.com/catalogs/charts/v1/catalog.json",
          "data": {"@path": "/sales"}
        }
      ]
    }
  }
]`;

  protected readonly agentLoadTs = `import {readFileSync} from 'node:fs';
import {A2uiGenerator, CatalogConfig, ExpressFormatFactory} from '@a2ui/agent';
import {Catalog} from '@a2ui/web_core';

const travelCatalog = Catalog.fromJson(
  JSON.parse(readFileSync('./catalogs/travel.json', 'utf8')),
);

const generator = new A2uiGenerator(
  [new CatalogConfig(travelCatalog)],
  undefined,
  new ExpressFormatFactory(),
);`;
}