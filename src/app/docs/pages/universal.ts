import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-universal',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="指南" heading="通用 Web 组件">
        用 A2uiLitElement 写一次自定义组件，直接注册进 Lit、React、Angular 三个目录，无需逐框架包装。
        属性契约用 Zod 声明，web_core 在把值交给你的元素之前解析好绑定、函数调用、子引用与动作。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="api">第一步：声明属性契约</h2>
      <p>ComponentApi 的 name 是 A2UI JSON 里的组件名；schema 用 DynamicStringSchema
      让字段同时接受字面量与数据绑定：</p>
      <app-code lang="ts" label="stat-card.api.ts(v1.0)" [code]="apiTs" />
      <p>安装：<code>bun add @a2ui/web_core lit zod</code>，再加上宿主框架的渲染器包。
      v0.9.1 把导入路径换成 <code>@a2ui/web_core/v0_9</code>。</p>

      <h2 id="element">第二步：实现元素</h2>
      <p>继承 A2uiLitElement，从 <code>this.controller.props</code> 读解析后的值,
      导出配对 API 与 tagName 的 WebComponentImplementation:</p>
      <app-code lang="ts" label="stat-card.ts" [code]="elementTs" />
      <p>命名注意：HTML 自定义元素的 tagName 必须带连字符(<code>a2ui-stat-card</code>);
      而 v1.0 消息里的组件 id 必须是 UAX #31 Unicode 标识符(<code>revenue_card</code>),不能带连字符。两套规则别混。</p>

      <h2 id="register">第三步：注册进目录</h2>
      <p>把 statCardComponent 与基础目录组件一起放进 Catalog，宿主渲染器挂载 surface 时自动注册自定义元素。
      Angular 的写法：</p>
      <app-code lang="ts" label="Angular:AngularCatalog + provideA2UI" [code]="angularTs" />
      <p>React 用 <code>new Catalog&lt;ReactCatalogComponent&gt;(...)</code> +
      <code>&lt;A2uiSurface surface=&#123;surface&#125; /&gt;</code>;Lit 直接
      <code>new Catalog(...)</code> + <code>&lt;a2ui-surface&gt;</code>。
      智能体侧随后就能发 <code>&#123;"id": "root", "component": "StatCard", "label": ..., "value": ...&#125;</code>。</p>

      <h2 id="props">解析后的属性类型</h2>
      <ul>
        <li><strong>Action。</strong>解析为异步回调 <code>props.action?.()</code>，触发时发事件或执行函数调用。</li>
        <li><strong>Child / ChildList。</strong>解析为子引用；在 render 里对每个引用调
          <code>this.renderNode(ref)</code>，可挂载基础目录、通用或原生框架子组件。</li>
        <li><strong>双向绑定。</strong>Dynamic* schema 自动生成
          <code>props.set&lt;Prop&gt;(next)</code> 写回器，写进绑定的 JSON Pointer。</li>
        <li><strong>校验。</strong>schema 合并 CheckableSchema 后，props.isValid 与
          props.validationErrors 响应式可用；把 aria-invalid/aria-describedby 绑在内层输入控件上,
          不要用 role="alert",避免挂载时读屏器误报。</li>
      </ul>

      <h2 id="styling">Light DOM 与主题</h2>
      <p>A2uiLitElement 默认渲染进 Light DOM:宿主的全局样式、设计系统、Tailwind 工具类直接生效。
      static styles 仍会生效——<code>:host</code> 被重写为标签名、后代规则加标签前缀防泄漏。
      宿主用 CSS 自定义属性主题化：</p>
      <app-code lang="css" label="宿主样式(React 放 App.css,Angular 放全局 styles.css)" [code]="themeCss" />
      <p>Angular 的模拟视图封装会把组件样式隔离掉，所以自定义属性必须写在全局样式里。
      需要封装或原生 slot 时才启用 Shadow DOM:重写
      <code>createRenderRoot()</code> 返回 <code>this.attachShadow(&#123;mode: 'open'&#125;)</code>。</p>

      <h2 id="nolit">不用 Lit 也行</h2>
      <p>渲染契约不依赖 Lit:任何继承 HTMLElement、实现 A2uiWebComponentElement 的类都可以。
      连接时 <code>new GenericBinder(context, schema)</code> 订阅属性更新，断开时 unsubscribe +
      dispose；子元素按 <code>childId:childPath</code> 缓存，列表刷新时保住焦点与内部状态。
      完整示例与生命周期细节见
      <a href="https://a2ui.org/guides/authoring-universal-components/" target="_blank" rel="noopener">官方 Universal Components 指南</a>;
      目录契约的写法见<a routerLink="/docs/define-catalog">定义目录</a>。</p>
    </div>
  `,
})
export class UniversalPage {
  protected readonly apiTs = `import {z} from 'zod';
import {type ComponentApi} from '@a2ui/web_core';
import {DynamicStringSchema} from '@a2ui/web_core/v1_0';

export const StatCardApi = {
  name: 'StatCard',
  schema: z.object({
    label: DynamicStringSchema,
    value: DynamicStringSchema,
  }),
} satisfies ComponentApi;`;

  protected readonly elementTs = `import {css, html} from 'lit';
import {A2uiLitElement, type WebComponentImplementation} from '@a2ui/web_core/universal';
import {StatCardApi} from './stat-card.api.js';

export class StatCardElement extends A2uiLitElement<typeof StatCardApi> {
  static override styles = css\`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 8px;
    }
    .label { font-size: 0.875rem; color: #64748b; }
    .value { font-size: 1.5rem; font-weight: 700; }
  \`;

  protected override readonly api = StatCardApi;

  override render() {
    const {label, value} = this.controller.props;
    return html\`
      <div class="label">\${typeof label === 'string' ? label : ''}</div>
      <div class="value">\${typeof value === 'string' ? value : ''}</div>
    \`;
  }
}

export const statCardComponent: WebComponentImplementation<typeof StatCardApi.schema> = {
  ...StatCardApi,
  tagName: 'a2ui-stat-card',
  element: StatCardElement,
};`;

  protected readonly angularTs = `import {ApplicationConfig, Component} from '@angular/core';
import {
  AngularCatalog, BASIC_COMPONENTS, BASIC_FUNCTIONS,
  SurfaceComponent, provideA2UI,
} from '@a2ui/angular';
import {statCardComponent} from './stat-card.js';

const analyticsCatalog = new AngularCatalog(
  'https://example.com/catalogs/analytics/v1/catalog.json',
  '1.0',
  [...BASIC_COMPONENTS, statCardComponent],
  BASIC_FUNCTIONS,
);

export const appConfig: ApplicationConfig = {
  providers: [
    provideA2UI({
      catalogs: [analyticsCatalog],
      processorOptions: {unifiedOutbound: true},
    }),
  ],
};

@Component({
  selector: 'app-root',
  imports: [SurfaceComponent],
  template: \`<a2ui-v09-surface surfaceId="main" />\`,
})
export class AppComponent {}`;

  protected readonly themeCss = `a2ui-stat-card {
  --border-color: #3b82f6;
}`;
}