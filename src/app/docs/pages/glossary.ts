import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-glossary',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="概念" heading="术语表">
        协议、SDK 与生成式 UI 模式里出现的全部名词，按字母排序。
        深入解释见<a routerLink="/docs/concepts">核心概念</a>及其子页。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="a">A</h2>
      <table>
        <tbody>
          <tr><th scope="row">A2UI</th><td>Agent to User Interface。开源生成式 UI 框架：流式协议 + 原生渲染器 + Agent SDK。智能体跨 Web、移动、桌面生成有状态原生界面，不发送可执行代码、HTML 或 CSS。</td></tr>
          <tr><th scope="row">A2UI message</th><td>智能体与渲染器之间交换的单个 JSON 信封。两个方向：agent_to_renderer 与 renderer_to_agent。流可以是进行中、已完成或被打断。</td></tr>
          <tr><th scope="row">A2UI tag</th><td>模型输出里的分隔标签：<code>&lt;a2ui&gt;</code>(Express)与 <code>&lt;a2ui-json&gt;</code>(Direct JSON),标记结构化 UI 块，解析器先把它们与散文分离。</td></tr>
          <tr><th scope="row">A2uiGenerator</th><td>Agent SDK 顶层协调器：持有 CatalogConfig、提示词示例与默认推理格式工厂；createProcessor 按渲染器能力协商目录，返回请求处理器。</td></tr>
          <tr><th scope="row">Action</th><td>组件上的交互处理器(如 Button.action),二选一：event 发出出站 action 消息；functionCall 执行函数而不发事件。</td></tr>
          <tr><th scope="row">Agent</th><td>发出 agent_to_renderer 消息、处理入站事件与远程函数调用的应用或服务。通常含 LLM，也可以是确定性逻辑；可在服务端或客户端内运行。</td></tr>
          <tr><th scope="row">Agent SDK</th><td>智能体侧官方库(TS/Python/Dart),建于 Core 之上：裁剪目录、协商能力、生成提示词、编译推理格式、有状态校验供模型自我纠正。</td></tr>
          <tr><th scope="row">agent_to_renderer</th><td>v1.0 智能体→渲染器信封(v0.9.1 名 server_to_client)。version 加六个键之一：createSurface、updateComponents、updateDataModel、deleteSurface、callRendererFunction、agentFunctionResponse。</td></tr>
          <tr><th scope="row">Agent turn</th><td>响应一次提示或事件而发出的一组消息与文本。回合结束由传输层信号表示，不是 A2UI 消息。</td></tr>
        </tbody>
      </table>

      <h2 id="b">B</h2>
      <table>
        <tbody>
          <tr><th scope="row">Basic catalog</th><td>可选的通用参考目录，18 个组件 + 15 个函数(v1.0),框架适配器内置实现。catalogId 见<a routerLink="/docs/catalogs">目录</a>。</td></tr>
        </tbody>
      </table>

      <h2 id="c">C</h2>
      <table>
        <tbody>
          <tr><th scope="row">@call</th><td>v1.0 FunctionCall 的保留键，命名要调用的函数。v0.9.1 用普通 call；字面 @ 键双写转义。</td></tr>
          <tr><th scope="row">callAgentFunction</th><td>v1.0 渲染器→智能体消息，请求远程执行智能体侧函数；带唯一 functionCallId，智能体以 agentFunctionResponse 回复。v0.9.1 无此通道。</td></tr>
          <tr><th scope="row">callRendererFunction</th><td>v1.0 智能体→渲染器消息，执行渲染器注册的函数；仅限 allowedCallers 为 agentOnly/rendererOrAgent 且无用户激活要求的函数，以 rendererFunctionResponse 回复。</td></tr>
          <tr><th scope="row">Capabilities</th><td>经传输握手 metadata(非 A2UI 消息)上报的能力：渲染器声明 supportedCatalogIds 与可选 inlineCatalogs；智能体声明 supportedCatalogIds 与 acceptsInlineCatalogs。</td></tr>
          <tr><th scope="row">Catalog</th><td>带唯一 catalogId 的版本化 JSON Schema 文档，定义组件、函数与 Markdown instructions；显式白名单。v1.0 一个 surface 可混用多个目录。</td></tr>
          <tr><th scope="row">Catalog transformer</th><td>Agent SDK 接口，在提示词生成前过滤/适配目录以省 token、限能力。内置 ComponentPruningTransformer 与 FunctionPruningTransformer。</td></tr>
          <tr><th scope="row">CheckRule</th><td>客户端校验规则(v1.0 @checks):condition 求值为 ValidationResult 或布尔，配可选 message;error 级别阻塞控件，warning/info 不阻塞。</td></tr>
          <tr><th scope="row">ChildList</th><td>容器子级类型：静态 ComponentId 数组，或模板对象 <code>&#123;"path", "componentId"&#125;</code>，按数组元素逐个实例化并建立相对绑定作用域。</td></tr>
          <tr><th scope="row">Component</th><td>目录里声明的声明式 UI 元素，原生渲染。扁平邻接表传输，每项含唯一 id(v1.0 遵循 UAX #31)、component 类型、可选 @catalogId/@accessibility/@metadata.extensions；必须存在 root。</td></tr>
          <tr><th scope="row">Core SDK</th><td>每语言一个的框架无关基础库：消息模型、目录 schema、响应式状态容器、Pointer 解析、表达式求值、MessageProcessor、校验。Agent 与适配器共享。</td></tr>
        </tbody>
      </table>

      <h2 id="d">D</h2>
      <table>
        <tbody>
          <tr><th scope="row">Data binding</th><td>把组件动态属性连到数据模型路径：v1.0 <code>&#123;"@path"&#125;</code>,v0.9.1 <code>&#123;"path"&#125;</code>。显示组件单向响应式，输入组件本地双向。</td></tr>
          <tr><th scope="row">Data model</th><td>每 surface 隔离的响应式 JSON 状态。createSurface 内联或 updateDataModel 增量填充；本地编辑留在渲染侧，经事件 context、函数参数或 sendDataModel 选择性同步。</td></tr>
        </tbody>
      </table>

      <h2 id="e">E</h2>
      <table>
        <tbody>
          <tr><th scope="row">Envelope schema</th><td>定义外层线上结构的顶层 schema(version + 单个消息键),独立于目录；另有 *_list 与 *_list_wrapper 批处理变体。</td></tr>
          <tr><th scope="row">Event</th><td>Action 的智能体方向变体(action.event):必填 name，可选 context 与 userMessage；触发时解析绑定后发出 action 消息。</td></tr>
        </tbody>
      </table>

      <h2 id="f">F</h2>
      <table>
        <tbody>
          <tr><th scope="row">Framework adapter</th><td>框架专属的 Renderer SDK(Flutter/React/Lit/Angular/SwiftUI/Compose),内置基础目录实现，映射无障碍属性，支持自定义组件与本地函数。</td></tr>
          <tr><th scope="row">Function</th><td>目录 functions 里声明的命名带类型操作：参数 schema + returnType。执行侧取决于本地注册；allowedCallers 与 requiresUserActivation 治理调用。区别于 LLM tool。</td></tr>
          <tr><th scope="row">Function call</th><td>FunctionCall 对象:@call + 可选 catalogId + args。出现在属性绑定、校验 condition、Action 处理器与 RPC 信封里。</td></tr>
        </tbody>
      </table>

      <h2 id="g">G</h2>
      <table>
        <tbody>
          <tr><th scope="row">Generative UI patterns</th><td>常见非强制布局：Chat(时间序对话)、Canvas(持久 surface 的共享工作台)、Dashboard(按主题/角色排列)、Wizard(分步结构化输入)。</td></tr>
        </tbody>
      </table>

      <h2 id="i">I</h2>
      <table>
        <tbody>
          <tr><th scope="row">@index</th><td>v1.0 系统函数，返回 ChildList 模板内当前项的 0 起始下标，可加 offset；嵌套模板取最内层，模板外调用报错。</td></tr>
          <tr><th scope="row">Inference format</th><td>模型在 A2UI 标签内使用的结构化写法，编译成线上 JSON。Express(默认)、Direct JSON、实验性 Atom/Elemental(Python)。</td></tr>
        </tbody>
      </table>

      <h2 id="m">M</h2>
      <table>
        <tbody>
          <tr><th scope="row">MacroExpander</th><td>Python Agent SDK 的非对称变换器:@macro 定义复合组件，推理前注入 schema、推理后展开成基础目录子树，渲染器无需自定义代码。见<a routerLink="/docs/macros">使用宏</a>。</td></tr>
          <tr><th scope="row">MessageProcessor</th><td>Core SDK 的有状态控制器：校验消息、变更响应式状态、解析指针与调用、执行调用权限、发出出站消息、构建能力与数据模型metadata快照。</td></tr>
        </tbody>
      </table>

      <h2 id="n">N</h2>
      <table>
        <tbody>
          <tr><th scope="row">NoAI information</th><td>被认定不可交给模型的数据(支付细节、凭据、受监管记录)。不进事件 context、智能体函数参数与 sendDataModel surface，并在视觉上区分私密输入。见<a routerLink="/docs/security">安全模型</a>。</td></tr>
        </tbody>
      </table>

      <h2 id="p">P</h2>
      <table>
        <tbody>
          <tr><th scope="row">@path</th><td>v1.0 DataBinding 保留键，RFC 6901 JSON Pointer。前导 / 从根解析，无前导斜杠相对当前模板项。updateDataModel.path 与模板 path 仍是固定 schema 字段，不带 @。</td></tr>
        </tbody>
      </table>

      <h2 id="r">R</h2>
      <table>
        <tbody>
          <tr><th scope="row">Renderer</th><td>客户端运行时：上报目录能力、经 MessageProcessor 应用消息、原生渲染 surface、维护数据模型、执行本地函数、发出 renderer_to_agent 消息。</td></tr>
          <tr><th scope="row">renderer_to_agent</th><td>v1.0 渲染器→智能体信封(v0.9.1 名 client_to_server)。四个键之一：action、callAgentFunction、rendererFunctionResponse、error(校验与运行时错误码)。</td></tr>
        </tbody>
      </table>

      <h2 id="s">S</h2>
      <table>
        <tbody>
          <tr><th scope="row">Surface</th><td>隔离、不可嵌套的界面区域，全局唯一 surfaceId;createSurface 创建、deleteSurface 删除；创建时实例化保留的 Surface 容器，child 指向 root；自带数据模型，可多块并存。</td></tr>
        </tbody>
      </table>
      <p>英文原版见 <a href="https://a2ui.org/concepts/glossary/" target="_blank" rel="noopener">官方 Glossary</a>。</p>
    </div>
  `,
})
export class GlossaryPage {}