import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-concepts',
  imports: [RouterLink, CodeBlock],
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-mute">理解 A2UI / 核心概念</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">核心概念</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        五个名词撑起整个协议:Surface、组件树、目录、数据模型、动作。
        读完这一页,你就有了阅读消息参考与 SDK 文档所需的全部心智模型。
      </p>
    </header>

    <div class="doc-prose">
      <h2 id="architecture">架构总览</h2>
      <p>A2UI 应用分成两侧,中间是任意传输:</p>
      <ul>
        <li><strong>智能体侧(Agent)。</strong>你的模型 + Agent SDK。SDK 从目录生成提示词与技能,把模型输出编译成协议消息,并在服务端做有状态校验。</li>
        <li><strong>传输(Transport)。</strong>A2A、AG-UI、MCP、WebSocket、SSE、REST 都可以。消息只是带版本号的 JSON,协议不关心它们怎么到达。</li>
        <li><strong>渲染侧(Renderer)。</strong>MessageProcessor 维护每个 surface 的组件图与数据模型,渲染器把解析后的状态画成原生控件,并把用户交互发回智能体。</li>
      </ul>
      <p>两侧共享同一套 Core SDK 数据结构,因此服务端校验与客户端解析使用同一种实现,不会出现「两边理解不一致」。</p>

      <h2 id="surface">Surface:一块独立的界面</h2>
      <p>Surface 是渲染的基本单位,由 <code>surfaceId</code> 标识,在一个 MessageProcessor(通常对应一段会话)内必须唯一。
      创建 surface 会隐式实例化一个保留的 <code>Surface</code> 容器组件,它的 <code>child</code> 指向 <code>"root"</code>。
      一段对话里可以同时存在多个 surface:航班结果一张、酒店一张,互不干扰,各自独立更新与销毁。</p>
      <p>v1.0 的 <code>createSurface</code> 可以内联 <code>components</code> 与 <code>dataModel</code>,一条消息就完成初始化:</p>
      <app-code lang="json" label="createSurface 内联初始化" [code]="createInline" />

      <h2 id="tree">组件树:扁平邻接表</h2>
      <p>组件不是嵌套 JSON,而是一个扁平数组,彼此用 id 引用。每个 surface 必须有一个 <code>id: "root"</code> 的组件作为树根:</p>
      <app-code lang="json" label="updateComponents 扁平组件列表" [code]="flatTree" />
      <p>这个设计是为流式而生:</p>
      <ul>
        <li>模型可以按任意顺序逐个吐出组件,不必等整棵树闭合;渲染器收到一部分就先画一部分。</li>
        <li>更新时按 id 替换单个组件定义,兄弟子树不受影响,输入框的焦点与本地状态得以保留。</li>
        <li>校验简单:引用是否存在、放置是否合法,都是图上的检查。</li>
      </ul>

      <h2 id="catalog">目录:组件与函数的白名单</h2>
      <p>目录(Catalog)声明智能体可以使用的组件 schema 与客户端函数签名,是 A2UI 的安全护栏:
      渲染器只渲染目录里注册过的组件,未注册的一律拒绝。你决定目录里有什么,智能体决定从中画什么。</p>
      <p>官方基础目录(Basic Catalog)提供 18 个组件与 14 个函数,catalogId 为
      <code>https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json</code>:</p>
      <table>
        <thead><tr><th>类别</th><th>组件</th></tr></thead>
        <tbody>
          <tr><td>布局</td><td>Row、Column、List、Card、Tabs、Modal、Divider</td></tr>
          <tr><td>内容</td><td>Text、Image、Icon、Video、AudioPlayer</td></tr>
          <tr><td>输入</td><td>Button、TextField、CheckBox、ChoicePicker、Slider、DateTimeInput</td></tr>
        </tbody>
      </table>
      <table>
        <thead><tr><th>类别</th><th>函数</th></tr></thead>
        <tbody>
          <tr><td>校验</td><td>required、regex、length、numeric、email</td></tr>
          <tr><td>格式化</td><td>formatString、formatNumber、formatCurrency、formatDate、pluralize</td></tr>
          <tr><td>逻辑与导航</td><td>and、or、not、openUrl</td></tr>
        </tbody>
      </table>
      <p>业务组件(航班卡片、地图、商品详情)通过自定义目录加入。目录用 JSON Schema 描述,
      智能体侧与渲染侧读同一份定义;编写方法见<a routerLink="/docs/renderers">渲染器</a>文档。</p>

      <h2 id="data">数据模型与绑定</h2>
      <p>每个 surface 带一个 JSON 数据模型。组件属性可以是字面量,也可以是绑定:
      v1.0 用 <code>&#123;"@path": "/outbound/price"&#125;</code> 指向数据模型里的位置(RFC 6901 JSON Pointer)。
      数据变化时,所有绑定到该位置的组件自动刷新,无需重发组件定义:</p>
      <app-code lang="json" label="绑定与增量数据更新" [code]="binding" />
      <p>输入类组件(TextField、Slider、CheckBox 等)的绑定是双向的:用户编辑会写回本地数据模型,
      智能体随后通过 action 的 context 或同步的数据模型拿到最新值。这让「乘客人数」这类纯本地交互不需要往返智能体。</p>

      <h2 id="actions">动作与函数</h2>
      <p>交互组件通过 <code>action.event</code> 声明点击后发生什么。渲染器先解析 context 与 userMessage 里的绑定,再发出 action 消息:</p>
      <app-code lang="json" label="Button 上的事件动作" [code]="actionExample" />
      <p>除了事件,还有两类函数调用:</p>
      <ul>
        <li><strong>客户端函数。</strong>目录里注册的本地实现,如校验、格式化、openUrl。v1.0 起智能体可以用 <code>callRendererFunction</code> 远程调用声明了相应权限的客户端函数,渲染器用 <code>rendererFunctionResponse</code> 回传结果。</li>
        <li><strong>智能体函数。</strong>渲染器用 <code>callAgentFunction</code> 请求智能体侧执行的能力(如查询行李额度),智能体用 <code>agentFunctionResponse</code> 回传。</li>
      </ul>
      <p>完整的消息字段见<a routerLink="/docs/messages">消息参考</a>。</p>

      <h2 id="express">推理格式:模型写的 ≠ 线上跑的</h2>
      <p>直接让模型输出完整协议 JSON 既费 token 又容易出错:重复的键名、手写组件 id、深层嵌套的花括号,
      让原始 JSON 比紧凑的构造器调用长约三倍。Agent SDK 默认使用 <strong>A2UI Express</strong>:
      模型用位置参数调用组件构造器、用 <code>$/path = value</code> 写数据、内联嵌套子组件,
      编译器再把它展平成带确定性 id 的标准消息:</p>
      <app-code lang="text" label="Express 块(官方示例)" [code]="expressSnippet" />
      <p>推理格式是可插拔的:Express、Direct JSON 等格式编译出的消息完全相同,客户端无需任何改动。
      格式对比与 token 基准见<a routerLink="/docs/agent-sdk">Agent SDK</a> 文档。</p>

      <h2 id="glossary">术语速查</h2>
      <table>
        <thead><tr><th>术语</th><th>含义</th></tr></thead>
        <tbody>
          <tr><td>Agent</td><td>驱动对话与界面生成的智能体,模型选择由你的应用控制。</td></tr>
          <tr><td>Renderer</td><td>客户端渲染器,把 surface 状态画成原生控件。</td></tr>
          <tr><td>Surface</td><td>一块独立界面,由 surfaceId 标识,含组件树与数据模型。</td></tr>
          <tr><td>Catalog</td><td>组件与函数的白名单定义,JSON Schema 描述。</td></tr>
          <tr><td>MessageProcessor</td><td>渲染侧应用消息、维护 surface 状态的核心对象。</td></tr>
          <tr><td>A2uiGenerator</td><td>Agent SDK 入口:生成提示词、编译模型输出、有状态校验。</td></tr>
          <tr><td>Express</td><td>默认推理格式,紧凑标记语言,编译为标准协议消息。</td></tr>
          <tr><td>dataModel</td><td>surface 的 JSON 数据模型,绑定与双向输入的源头。</td></tr>
        </tbody>
      </table>
    </div>
  `,
})
export class ConceptsPage {
  protected readonly createInline = `{
  "version": "1.0",
  "createSurface": {
    "surfaceId": "flight_search",
    "catalogId": "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json",
    "components": [
      {"id": "root", "component": "Column", "children": ["title"]},
      {"id": "title", "component": "Text", "text": "Available Flights"}
    ],
    "dataModel": {"flights": [{"summary": "LH458 · BER -> SFO · $680"}]}
  }
}`;

  protected readonly flatTree = `{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "flight_search",
    "components": [
      {"id": "root", "component": "Column", "children": ["header", "btn_select"]},
      {"id": "header", "component": "Text", "text": "Outbound Flights"},
      {"id": "btn_label", "component": "Text", "text": "Select LH458 ($680)"},
      {
        "id": "btn_select",
        "component": "Button",
        "child": "btn_label",
        "variant": "primary",
        "action": {"event": {"name": "select_flight", "context": {"flightId": "LH458"}}}
      }
    ]
  }
}`;

  protected readonly binding = `{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "flight_search",
    "components": [
      {"id": "price", "component": "Text", "text": {"@path": "/outbound/price"}, "weight": 700}
    ]
  }
}

{
  "version": "1.0",
  "updateDataModel": {
    "surfaceId": "flight_search",
    "path": "/outbound/price",
    "value": "$428"
  }
}`;

  protected readonly actionExample = `{
  "id": "btn_confirm",
  "component": "Button",
  "child": "btn_confirm_label",
  "variant": "primary",
  "action": {
    "event": {
      "name": "confirm_booking",
      "userMessage": "确认预订 LH458",
      "context": {
        "flightId": "LH458",
        "passengers": {"@path": "/outbound/pax"}
      }
    }
  }
}`;

  protected readonly expressSnippet = `<a2ui>
$/flight/number = "NH 105"
$/flight/gate = "B12"
root = Card(
  Column([
    Text($/flight/number),
    Text($/flight/gate, "caption"),
    Button(Text("Board now"), action=Event("check_in", {flight: $/flight/number}))
  ])
)
</a2ui>`;
}