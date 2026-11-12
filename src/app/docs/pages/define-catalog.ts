import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-define-catalog',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="指南" heading="定义目录">
        自定义目录让智能体用上你的业务组件。流程是三步：写 JSON Schema 契约、智能体侧加载、渲染侧注册实现。
        两侧读同一份定义，CI 里再做一次对齐测试，契约就不会漂移。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="schema">第一步：写目录 schema</h2>
      <p>一份最小但完整的目录：一个 StatusBadge 组件，三个必填属性,
      <code>$defs</code> 里声明 anyComponent/anyFunction 供信封 schema 引用：</p>
      <app-code lang="json" label="status_catalog.json(v1.0)" [code]="catalogJson" />
      <ul>
        <li><code>$id</code> 与 <code>catalogId</code> 设为同一个 URI，全局唯一。</li>
        <li>动态属性用 <code>$ref</code> 指向 common_types 的 DynamicString 等类型，字面量与绑定都接受。</li>
        <li>没有函数时 <code>anyFunction</code> 用 <code>&#123;"not": &#123;&#125;&#125;</code> 表示空集。</li>
        <li>v0.9.1 版本要组合 ComponentCommon、设 <code>unevaluatedProperties: false</code>，且不支持顶层 instructions/metadata。</li>
      </ul>

      <h2 id="agent">第二步：智能体侧加载</h2>
      <app-code lang="ts" label="TypeScript:基础目录 + 自定义目录" [code]="agentTs" />
      <p>Python 用 <code>Catalog.from_json</code> + <code>CatalogConfig</code>,Dart 有对应 API;
      Swift/Kotlin 只做客户端渲染，没有服务端生成器。加载后目录自动进入提示词与校验。</p>

      <h2 id="client">第三步：渲染侧注册</h2>
      <app-code lang="tsx" label="React:Zod schema + createComponentImplementation" [code]="reactTs" />
      <p>Angular 用 <code>CatalogComponent</code> 子类 + computed 信号读属性，再
      <code>provideA2UI(&#123;catalogs: [new BasicCatalog(), statusCatalog]&#125;)</code>;
      Lit 用 <code>A2uiLitElement</code>(见<a routerLink="/docs/universal">通用 Web 组件</a>);
      Flutter 用 <code>ComponentImplementation</code> + builder。注册后，消息里的自定义组件要带
      <code>@catalogId</code> 指向这份目录(v0.9.1 则整 surface 绑定单一目录)。</p>

      <h2 id="functions">声明函数</h2>
      <p>函数 schema 声明参数、returnType 与调用权限。shareProduct 是典型的敏感操作:
      只能渲染器调用、且必须用户亲手触发：</p>
      <app-code lang="json" label="shareProduct 函数 schema" [code]="shareJson" />
      <p>校验函数返回 <code>validationResult</code>，客户端实现用
      <code>createFunctionImplementation</code> 注册：</p>
      <app-code lang="ts" label="TypeScript:validDiscount 校验函数" [code]="fnTs" />

      <h2 id="placement">放置规则与子槽</h2>
      <p><code>allowedParents</code>/<code>allowedChildren</code> 约束组件能放在哪、能装什么。
      例如 ProductCard 只允许放在 Column/List 里、只允许装 Button;
      子槽属性用 ChildList(多子)或 Child(单子),Action 类型属性接收事件或函数调用。
      <code>Surface</code> 是保留容器名，可以出现在 allowedParents 里，但不能用作组件名。</p>

      <h2 id="instructions">instructions、metadata 与无障碍</h2>
      <ul>
        <li><strong>instructions。</strong>顶层 Markdown，目录激活时附加进系统提示，写清组件的使用场景与禁忌。</li>
        <li><strong>metadata.extensions。</strong>自定义扩展键；<code>a2ui_</code> 前缀为协议保留。</li>
        <li><strong>@accessibility。</strong>组件实例上的无障碍属性：label、description(可绑定)、live、hidden,
          适配器映射到平台 API。</li>
      </ul>
      <app-code lang="json" label="@accessibility 示例" [code]="a11yJson" />

      <h2 id="parity">CI 对齐测试</h2>
      <p>智能体与渲染器各持一份目录加载结果，测试里比较规范化后的属性而非序列化字符串:
      catalogId、protocolVersion、组件/函数名集合、allowedParents/allowedChildren、returnType、allowedCallers。
      任何一侧改了 schema 而另一侧没跟上，CI 立刻红。完整步骤与六语言注册示例见
      <a href="https://a2ui.org/guides/defining-a-catalog/" target="_blank" rel="noopener">官方 Define a Catalog 指南</a>。</p>
    </div>
  `,
})
export class DefineCatalogPage {
  protected readonly catalogJson = `{
  "$id": "https://example.com/catalogs/status/v1/catalog.json",
  "catalogId": "https://example.com/catalogs/status/v1/catalog.json",
  "protocolVersion": "1.0",
  "title": "Status Catalog",
  "components": {
    "StatusBadge": {
      "type": "object",
      "properties": {
        "component": {"const": "StatusBadge"},
        "label": {"$ref": "common_types.json#/$defs/DynamicString"},
        "status": {"enum": ["info", "success", "warning"]}
      },
      "required": ["component", "label", "status"]
    }
  },
  "functions": {},
  "$defs": {
    "anyComponent": {
      "oneOf": [{"$ref": "#/components/StatusBadge"}],
      "discriminator": {"propertyName": "component"}
    },
    "anyFunction": {"not": {}}
  }
}`;

  protected readonly agentTs = `import {readFileSync} from 'node:fs';
import {A2uiGenerator, CatalogConfig, ExpressFormatFactory} from '@a2ui/agent';
import {Catalog, basicCatalog} from '@a2ui/web_core';

const statusCatalog = Catalog.fromJson(
  JSON.parse(readFileSync('./status_catalog.json', 'utf8')),
);

const generator = new A2uiGenerator(
  [new CatalogConfig(basicCatalog), new CatalogConfig(statusCatalog)],
  undefined,
  new ExpressFormatFactory(),
);`;

  protected readonly reactTs = `import {z} from 'zod';
import {createComponentImplementation} from '@a2ui/react';
import {Catalog, MessageProcessor} from '@a2ui/web_core';
import {DynamicStringSchema, basicCatalog} from '@a2ui/web_core/v1_0';

const StatusBadgeApi = {
  name: 'StatusBadge',
  schema: z.object({
    label: DynamicStringSchema,
    status: z.enum(['info', 'success', 'warning']),
  }),
};

const StatusBadge = createComponentImplementation(StatusBadgeApi, ({props}) => (
  <span className={\`badge badge-\${props.status}\`}>{String(props.label)}</span>
));

const statusCatalog = new Catalog(
  'https://example.com/catalogs/status/v1/catalog.json', '1.0', [StatusBadge], [],
);
const processor = new MessageProcessor([basicCatalog, statusCatalog]);`;

  protected readonly shareJson = `{
  "shareProduct": {
    "type": "object",
    "returnType": "void",
    "allowedCallers": "rendererOnly",
    "requiresUserActivation": true,
    "properties": {
      "@call": {"const": "shareProduct"},
      "args": {
        "type": "object",
        "properties": {
          "title": {"$ref": "common_types.json#/$defs/DynamicString"},
          "url": {"$ref": "common_types.json#/$defs/DynamicString"}
        },
        "required": ["title", "url"],
        "unevaluatedProperties": false
      }
    },
    "required": ["@call", "args"]
  }
}`;

  protected readonly fnTs = `import {createFunctionImplementation} from '@a2ui/web_core';
import {DynamicNumberSchema} from '@a2ui/web_core/v1_0';
import {z} from 'zod';

export const validDiscount = createFunctionImplementation(
  {
    name: 'validDiscount',
    returnType: 'validationResult',
    schema: z.object({percentOff: DynamicNumberSchema}),
  },
  ({percentOff}) => {
    const n = typeof percentOff === 'number' ? percentOff : NaN;
    return n >= 0 && n <= 70
      ? {valid: true}
      : {valid: false, message: 'Discount must be between 0 and 70.'};
  },
);`;

  protected readonly a11yJson = `{
  "id": "close_button",
  "component": "Button",
  "child": "close_icon",
  "action": {"event": {"name": "close_dialog"}},
  "@accessibility": {
    "label": "Close dialog",
    "description": {"@path": "/dialog/unsavedWarning"}
  }
}`;
}