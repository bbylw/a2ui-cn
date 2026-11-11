import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-renderers',
  imports: [RouterLink, CodeBlock],
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-mute">构建 / 渲染器</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">渲染器</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        同一份协议消息,六个官方渲染器在各自平台渲染。
        本页给出 Angular 与 React 的完整接入代码(本站正在使用),以及自定义目录的方法。
      </p>
    </header>

    <div class="doc-prose">
      <h2 id="official">官方渲染器</h2>
      <table>
        <thead><tr><th>框架</th><th>包</th><th>协议版本</th></tr></thead>
        <tbody>
          <tr><td>React</td><td><code>@a2ui/react</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Angular</td><td><code>@a2ui/angular</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Lit</td><td><code>@a2ui/lit</code></td><td>v0.8 / v0.9.1 / v1.0</td></tr>
          <tr><td>Flutter</td><td><code>a2ui_flutter</code></td><td>v0.9.1 / v1.0</td></tr>
          <tr><td>SwiftUI</td><td><code>A2UISwiftUI</code>(SPM)</td><td>v0.9.1 / v1.0</td></tr>
          <tr><td>Jetpack Compose</td><td><code>androidx.a2ui.compose</code></td><td>v0.9.1</td></tr>
        </tbody>
      </table>
      <p>Web 三兄弟共享 <code>@a2ui/web_core</code> 的 MessageProcessor 与基础目录实现;
      <code>@a2ui/markdown-it</code> 负责 Text 组件里的 Markdown 渲染。
      所有官方渲染器都内置基础目录,样式继承宿主框架的主题系统。</p>

      <h2 id="angular">Angular 接入</h2>
      <app-code lang="bash" label="安装" [code]="ngInstall" />
      <p>在应用配置里提供目录、动作处理器与 Markdown 渲染器,并注入基础目录样式(幂等,重复调用安全)。
      基础目录的组件以通用 Web 组件(Lit 自定义元素)实现,<code>provideA2UI</code> 默认开启
      <code>useUniversalComponents</code>;用 <code>createComponentImplementation</code> 注册的自定义组件
      则可以是原生 Angular 组件类:</p>
      <app-code lang="ts" label="app.config.ts" [code]="ngConfig" />
      <p>之后把收到的消息交给 <code>A2uiRendererService.processMessages</code>,
      用 <code>SurfaceComponent</code> 按 surfaceId 挂载界面。组件选择器 <code>a2ui-v09-surface</code>
      是历史命名,同样渲染 v1.0 surface:</p>
      <app-code lang="ts" label="flight-panel.ts" [code]="ngSurface" />
      <p>本站首页的航班演示与双渲染器区块就是这样驱动的:消息到达 → processMessages → surface 自动更新,
      用户点击按钮后 actionHandler 收到 action,写入共享日志。</p>

      <h2 id="react">React 接入</h2>
      <app-code lang="bash" label="安装" [code]="reactInstall" />
      <p>React 侧直接使用 web_core 的 MessageProcessor:创建处理器、订阅 surface 增删、增量处理消息,
      再用 <code>A2uiSurface</code> 渲染每个 surface:</p>
      <app-code lang="ts" label="agent-surfaces.tsx" [code]="reactSurface" />
      <p>Markdown 与基础样式只需初始化一次:</p>
      <app-code lang="ts" label="a2ui-setup.ts" [code]="reactSetup" />

      <h2 id="lit">Lit 接入</h2>
      <p>Lit 渲染器把每个目录组件注册为自定义元素。组件类继承 <code>A2uiLitElement</code>,
      通过 <code>this.controller.props</code> 读取已解析的属性,目录用
      <code>new Catalog(id, '1.0', components, BASIC_FUNCTIONS)</code> 注册后交给 MessageProcessor。
      完整示例见官方文档的
      <a href="https://a2ui.org/concepts/catalogs/#registering-a-catalog-in-a-renderer" target="_blank" rel="noopener">Registering a catalog in a renderer</a>。</p>

      <h2 id="mobile">Flutter、SwiftUI 与 Compose</h2>
      <p>移动端的模式完全一致:注册目录(组件 schema + 原生 builder)、创建 MessageProcessor、挂载 surface。
      以 Flutter 为例,一个航班卡片组件这样注册:</p>
      <app-code lang="dart" label="Flutter 自定义组件(节选)" [code]="flutterSnippet" />
      <p>SwiftUI 通过 Swift Package Manager 引入 <code>A2UISwiftUI</code> 与 <code>BasicCatalog</code>;
      Jetpack Compose 使用 AndroidX 的 <code>androidx.a2ui.compose</code> 与 <code>material3-a2ui</code>,
      目前支持 v0.9.1。两者注册目录的代码结构相同,见
      <a href="https://a2ui.org/concepts/catalogs/" target="_blank" rel="noopener">官方目录文档</a>。</p>

      <h2 id="custom">自定义目录</h2>
      <p>业务组件通过自定义目录加入:声明 name、allowedParents(允许出现在哪些父组件下)与 zod/JSON Schema,
      再配上原生实现。以 React 的航班卡片为例:</p>
      <app-code lang="ts" label="FlightStatusCard(React)" [code]="customCatalog" />
      <p>要点:</p>
      <ul>
        <li><strong>schema 即契约。</strong>智能体侧的提示词与校验、渲染侧的属性解析,都从这份 schema 生成。</li>
        <li><strong>allowedParents 约束放置。</strong>例如只允许卡片出现在 Column/List 里,校验器会拒绝违规树。</li>
        <li><strong>函数同样注册。</strong>把 <code>BASIC_FUNCTIONS</code> 换成或拼接你的函数实现,并声明 allowedCallers。</li>
        <li><strong>Universal Web Components。</strong>Web 上可以写一次自定义组件,同时注册进 Lit、React、Angular 三个渲染器。</li>
      </ul>

      <h2 id="theming">主题</h2>
      <p>v1.0 移除了 createSurface 里的 theme 属性,样式完全由宿主接管。Web 基础目录暴露一组 CSS 变量,
      在容器上覆盖即可换肤(本站的 <code>.a2ui-frame</code> 就是这样做的):</p>
      <app-code lang="css" label="覆盖基础目录主题变量" [code]="themeVars" />

      <h2 id="community">社区渲染器</h2>
      <p>社区还维护了 Vue、Svelte、Lynx、React Native、Compose Multiplatform、终端(Ink/Bubble Tea)、
      HarmonyOS、Three.js 等渲染器,以及 Google Maps 等领域目录。完整名单、版本支持与提交方式见
      <a routerLink="/docs/ecosystem">生态与路线图</a>。</p>
    </div>
  `,
})
export class RenderersPage {
  protected readonly ngInstall = 'bun add @a2ui/angular @a2ui/web_core @a2ui/markdown-it';
  protected readonly reactInstall = 'bun add @a2ui/react @a2ui/web_core @a2ui/markdown-it';

  protected readonly ngConfig = `import {ApplicationConfig, Injector, inject} from '@angular/core';
import {BasicCatalog, provideA2UI, provideMarkdownRenderer} from '@a2ui/angular';
import {renderMarkdown} from '@a2ui/markdown-it';
import {injectBasicCatalogStyles} from '@a2ui/web_core/v1_0';

injectBasicCatalogStyles();

export const appConfig: ApplicationConfig = {
  providers: [
    provideA2UI(() => {
      const injector = inject(Injector);
      return {
        catalogs: [new BasicCatalog()],
        useUniversalComponents: true,
        actionHandler: action => injector.get(AgentTransport).send(action),
      };
    }),
    provideMarkdownRenderer(renderMarkdown),
  ],
};`;

  protected readonly ngSurface = `import {Component, inject} from '@angular/core';
import {A2uiRendererService, SurfaceComponent} from '@a2ui/angular';

@Component({
  selector: 'app-flight-panel',
  imports: [SurfaceComponent],
  template: '<a2ui-v09-surface surfaceId="flight-demo" />',
})
export class FlightPanel {
  private readonly renderer = inject(A2uiRendererService);

  onMessages(messages: unknown[]): void {
    this.renderer.processMessages(messages);
  }
}`;

  protected readonly reactSurface = `import {useEffect, useState} from 'react';
import {A2uiSurface, type ReactCatalogComponent} from '@a2ui/react';
import {MessageProcessor, basicCatalog, type SurfaceModel} from '@a2ui/web_core/v1_0';

export function AgentSurfaces({processor}: {processor: MessageProcessor<ReactCatalogComponent>}) {
  const [surfaces, setSurfaces] = useState<SurfaceModel<ReactCatalogComponent>[]>(() =>
    Array.from(processor.getSurfaces().values()),
  );

  useEffect(() => {
    const sync = () => setSurfaces(Array.from(processor.getSurfaces().values()));
    const createdSub = processor.onSurfaceCreated(sync);
    const deletedSub = processor.onSurfaceDeleted(sync);
    sync();
    return () => {
      createdSub.unsubscribe();
      deletedSub.unsubscribe();
    };
  }, [processor]);

  return (
    <div className="a2ui-surfaces">
      {surfaces.map(surface => (
        <A2uiSurface key={surface.id} surface={surface} />
      ))}
    </div>
  );
}

// 创建处理器:目录 + 动作回调
const processor = new MessageProcessor<ReactCatalogComponent>([basicCatalog], action => {
  transport.send(action); // 发回智能体
});
processor.processMessages(incomingMessages);`;

  protected readonly reactSetup = `import {renderMarkdown} from '@a2ui/markdown-it';
import {injectBasicCatalogStyles, setMarkdownRenderer} from '@a2ui/web_core/v1_0';

injectBasicCatalogStyles();
setMarkdownRenderer(renderMarkdown);`;

  protected readonly flutterSnippet = `final flightStatusCard = ComponentImplementation(
  name: 'FlightStatusCard',
  allowedParents: ['Column', 'List'],
  schema: Schema.object(
    properties: {
      'component': Schema.string(enumValues: ['FlightStatusCard']),
      'flightNumber': CommonSchemasV1.dynamicString,
      'fareAmount': CommonSchemasV1.dynamicNumber,
    },
    required: ['component', 'flightNumber'],
  ),
  builder: (context, node, props, buildChild) {
    final flightNumber = props.string('flightNumber') ?? '';
    final fare = props.number('fareAmount');
    return Card(
      child: ListTile(
        leading: const Icon(Icons.flight_takeoff),
        title: Text('Flight $flightNumber'),
        trailing: fare != null ? Text('\\\$' + fare.toStringAsFixed(2)) : null,
      ),
    );
  },
);

final processor = MessageProcessor(catalogs: [travelCatalog]);`;

  protected readonly customCatalog = `import {z} from 'zod';
import {createComponentImplementation} from '@a2ui/react';
import {Catalog, type ComponentApi} from '@a2ui/web_core';
import {BASIC_FUNCTIONS, DynamicNumberSchema, DynamicStringSchema} from '@a2ui/web_core/v1_0';

const FlightStatusCardApi = {
  name: 'FlightStatusCard',
  allowedParents: ['Column', 'List'],
  schema: z.object({
    flightNumber: DynamicStringSchema,
    fareAmount: DynamicNumberSchema.optional(),
  }),
} satisfies ComponentApi;

const FlightStatusCard = createComponentImplementation(FlightStatusCardApi, ({props}) => {
  const flightNumber = typeof props.flightNumber === 'string' ? props.flightNumber : '';
  const fareAmount = typeof props.fareAmount === 'number' ? props.fareAmount : undefined;
  return (
    <div className="flight-card">
      <strong>Flight {flightNumber}</strong>
      {fareAmount !== undefined && <span>\${fareAmount.toFixed(2)}</span>}
    </div>
  );
});

export const travelCatalog = new Catalog(
  'https://example.com/catalogs/travel/v1/catalog.json',
  '1.0',
  [FlightStatusCard],
  BASIC_FUNCTIONS,
);`;

  protected readonly themeVars = `.a2ui-frame {
  --a2ui-color-primary: #1a73e8;
  --a2ui-color-surface: #ffffff;
  --a2ui-font-family-title: "Space Grotesk Variable", "Noto Sans SC Variable", sans-serif;
  --a2ui-border-radius: 12px;
}`;
}