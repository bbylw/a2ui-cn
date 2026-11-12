import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-agent-sdk',
  imports: [RouterLink, CodeBlock],
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-mute">指南 / Agent 集成</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Agent 集成</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Agent SDK 把模型接到 A2UI 协议上:从目录生成提示词与技能,把模型输出编译成协议消息,
        在服务端做有状态校验。模型选择、工具执行与对话状态仍然完全由你的应用控制。
      </p>
    </header>

    <div class="doc-prose">
      <h2 id="layers">三层 SDK</h2>
      <table>
        <thead><tr><th>层</th><th>职责</th><th>包</th></tr></thead>
        <tbody>
          <tr><td>Core SDK</td><td>协议数据结构、消息解析/序列化、目录校验、surface 状态、绑定与表达式求值。</td><td><code>@a2ui/web_core</code> · <code>a2ui-core</code> · <code>a2ui_core</code>(Dart)· Swift/Kotlin 核心</td></tr>
          <tr><td>Agent SDK</td><td>目录协商、提示词/技能生成、推理格式编译、有状态校验。</td><td><code>@a2ui/agent</code> · <code>a2ui-agent-sdk</code> · <code>a2ui_agent</code>(Dart)</td></tr>
          <tr><td>Renderer SDK</td><td>把 surface 状态挂载到 UI 框架,执行本地函数,派发 action。</td><td>见<a routerLink="/docs/renderers">客户端集成</a></td></tr>
        </tbody>
      </table>
      <p>Agent 与 Renderer SDK 都构建在同语言的 Core SDK 之上:服务端校验与客户端解析共享一份实现。
      Python 智能体 + SwiftUI 客户端、TypeScript 全栈、Dart 全栈,都是官方支持的组合。</p>

      <h2 id="duties">Agent SDK 做的五件事</h2>
      <ol>
        <li><strong>目录协商。</strong>对照渲染器上报的能力,选出双方都支持的目录与协议版本。</li>
        <li><strong>生成提示词与技能。</strong>从目录 schema 直接生成系统提示、语法说明与示例;组件一变,提示词跟着变,不再手写会过期的 prompt。</li>
        <li><strong>编译推理格式。</strong>把模型的 Express 或 Direct JSON 输出(流式或批量)编译成标准协议消息。</li>
        <li><strong>有状态校验。</strong>对照服务端维护的 surface 状态校验每条出站消息:坏 id、违规放置、schema 不匹配,在到达客户端前就反馈给模型自纠。</li>
        <li><strong>框架集成。</strong>提供 Google ADK(<code>a2ui-adk</code>)与 A2A(<code>a2ui-a2a</code>)集成,Python 还支持服务端 <code>@macro</code> 展开。</li>
      </ol>

      <h2 id="typescript">TypeScript 集成</h2>
      <app-code lang="bash" label="安装" [code]="tsInstall" />
      <p>核心对象是 <code>A2uiGenerator</code>:配置目录、推理格式与 few-shot 示例;
      用 <code>RendererState</code> 按会话跟踪 surface 状态。下面的服务类把你的模型流式回调注入进来,
      与具体 LLM 客户端解耦:</p>
      <app-code lang="ts" label="order-agent-service.ts" [code]="tsService" />
      <p>每轮对话的典型流程:</p>
      <ol>
        <li>取(或创建)该会话的 <code>RendererState</code>。</li>
        <li>用 generator 生成系统提示词,连同用户消息交给模型,得到流式文本。</li>
        <li>把文本增量喂给 generator 的编译接口,产出校验过的 <code>AgentToRendererMessage</code>,经传输发给渲染器。</li>
        <li>渲染器发回的 action / callAgentFunction 交给 <code>RendererToAgentMessageProcessor</code> 处理,更新状态并驱动下一轮。</li>
      </ol>

      <h2 id="python-dart">Python 与 Dart</h2>
      <app-code lang="bash" label="Python" [code]="pyInstall" />
      <app-code lang="bash" label="Dart" [code]="dartInstall" />
      <p>API 形状与 TypeScript 一致:<code>A2uiGenerator(catalogs=[CatalogConfig(catalog=c) ...], inference_format_factory=ExpressFormatFactory())</code>,
      会话状态用 <code>RendererState</code> 字典维护。Travel A2UI 示例的服务器就是 Python 实现,
      见<a routerLink="/docs/quickstart">快速开始</a>。</p>

      <h2 id="formats">推理格式</h2>
      <table>
        <thead><tr><th>格式</th><th>哨兵标签</th><th>说明</th></tr></thead>
        <tbody>
          <tr><td>Express(默认)</td><td><code>&lt;a2ui&gt;...&lt;/a2ui&gt;</code></td><td>紧凑位置参数 DSL,嵌套组件调用 + <code>$/path</code> 数据赋值,编译成扁平 JSON。原始 wire JSON 约比它长三倍。</td></tr>
          <tr><td>Direct JSON</td><td><code>&lt;a2ui-json&gt;...&lt;/a2ui-json&gt;</code></td><td>模型直接输出标准消息 JSON,SDK 负责剥离 Markdown 围栏与增量字符串修复。</td></tr>
          <tr><td>自定义</td><td>格式自定</td><td>实现 <code>InferenceFormatFactory</code> 契约即可接入任何领域语法。</td></tr>
        </tbody>
      </table>
      <p>格式可插拔的意义:换格式不需要改客户端。受监管或确定性的工作流甚至可以跳过模型,
      在服务端代码里直接构造消息(分类器、状态机或 macro 驱动)。</p>

      <h2 id="skills">Agent skills</h2>
      <p>两层「技能」不要混淆:</p>
      <ul>
        <li><strong>运行时技能。</strong>Python 与 TypeScript SDK 的 <code>SkillGenerator</code> 从你的目录生成 A2UI 技能:
        推理格式语法、组件与函数签名,随目录变化而变化,喂给驱动界面的模型。</li>
        <li><strong>编码智能体技能。</strong>运行 <code>npx skills add a2ui-project/a2ui</code>,
        给你的编码助手(Claude Code、Cursor 等)装上协议规则、SDK 集成指南与目录编写工作流。</li>
      </ul>

      <h2 id="next">下一步</h2>
      <p>客户端接入见<a routerLink="/docs/renderers">客户端集成</a>;消息字段见<a routerLink="/docs/messages">消息参考</a>;
      官方完整指南在 <a href="https://a2ui.org/guides/agent-integration/" target="_blank" rel="noopener">a2ui.org/guides/agent-integration</a>。</p>
    </div>
  `,
})
export class AgentSdkPage {
  protected readonly tsInstall = 'bun add @a2ui/agent @a2ui/web_core';
  protected readonly pyInstall = 'pip install a2ui-agent-sdk';
  protected readonly dartInstall = 'dart pub add a2ui_agent a2ui_core';

  protected readonly tsService = `import {
  A2uiGenerator,
  CatalogConfig,
  ExpressFormatFactory,
  RendererState,
  RendererToAgentMessageProcessor,
} from '@a2ui/agent';
import {basicCatalog} from '@a2ui/web_core/v1_0';

export type ModelStreamFn = (
  sessionId: string,
  systemPrompt: string,
  userMessage: string,
) => AsyncIterable<string>;

export class OrderAgentService {
  readonly catalogs = [
    basicCatalog,
    // 在这里加入自定义领域目录
  ];
  readonly generator = new A2uiGenerator(
    this.catalogs.map(catalog => new CatalogConfig(catalog)),
    undefined, // 可选 few-shot 示例(A2UI JSON,会反编译成当前格式)
    new ExpressFormatFactory(), // 默认;可换成 Direct JSON 等
  );
  private readonly sessions = new Map<string, RendererState>();

  constructor(private readonly callModel: ModelStreamFn) {}
}`;
}