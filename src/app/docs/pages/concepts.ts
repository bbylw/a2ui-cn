import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-concepts',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="概念" heading="核心概念">
        概念组的总览:架构、Surface 与组件树。读完这一页,你就有了阅读其余概念页与消息参考所需的心智模型;
        目录、数据绑定、动作、推理格式等各有专页深入。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="architecture">架构总览</h2>
      <p>A2UI 应用分成两侧,中间是任意传输:</p>
      <ul>
        <li><strong>智能体侧(Agent)。</strong>你的模型 + Agent SDK。SDK 从目录生成提示词与技能,把模型输出编译成协议消息,并在服务端做有状态校验。</li>
        <li><strong>传输(Transport)。</strong>A2A、AG-UI、MCP、WebSocket、SSE、REST 都可以。消息只是带版本号的 JSON,协议不关心它们怎么到达。</li>
        <li><strong>渲染侧(Renderer)。</strong>MessageProcessor 维护每个 surface 的组件图与数据模型,渲染器把解析后的状态画成原生控件,并把用户交互发回智能体。</li>
      </ul>
      <p>两侧共享同一套 Core SDK 数据结构,因此服务端校验与客户端解析使用同一种实现,不会出现「两边理解不一致」。
      各语言的包与版本矩阵见<a routerLink="/docs/sdks">SDK 一览</a>。</p>

      <h2 id="surface">Surface:一块独立的界面</h2>
      <p>Surface 是渲染的基本单位,由 <code>surfaceId</code> 标识,在一个 MessageProcessor(通常对应一段会话)内必须唯一。
      创建 surface 会隐式实例化一个保留的 <code>Surface</code> 容器组件,它的 <code>child</code> 指向 <code>"root"</code>。
      一段对话里可以同时存在多个 surface:航班结果一张、酒店一张,互不干扰,各自独立更新与销毁。Surface 不能嵌套。</p>
      <p>v1.0 的 <code>createSurface</code> 可以内联 <code>components</code> 与 <code>dataModel</code>,一条消息就完成初始化:</p>
      <app-code lang="json" label="createSurface 内联初始化" [code]="createInline" />

      <h2 id="tree">组件树:扁平邻接表</h2>
      <p>组件不是嵌套 JSON,而是一个扁平数组,彼此用 id 引用。每个 surface 必须有一个 <code>id: "root"</code> 的组件作为树根
      (v1.0 的 id 遵循 UAX #31 Unicode 标识符规则):</p>
      <app-code lang="json" label="updateComponents 扁平组件列表" [code]="flatTree" />
      <p>这个设计是为流式而生:</p>
      <ul>
        <li>模型可以按任意顺序逐个吐出组件,不必等整棵树闭合;渲染器收到一部分就先画一部分。</li>
        <li>更新时按 id 替换单个组件定义,兄弟子树不受影响,输入框的焦点与本地状态得以保留。</li>
        <li>校验简单:引用是否存在、放置是否合法,都是图上的检查。</li>
      </ul>

      <h2 id="map">概念地图</h2>
      <p>其余概念各有专页,建议按顺序阅读:</p>
      <ul>
        <li><a routerLink="/docs/messages">消息参考</a> —— 两个方向的全部信封与字段,协议的法律文本。</li>
        <li><a routerLink="/docs/catalogs">目录</a> —— 组件与函数的白名单契约,能力协商与多目录混用。</li>
        <li><a routerLink="/docs/data-binding">数据模型与绑定</a> —— 每 surface 的 JSON 状态,@path、双向输入、列表模板与同步通道。</li>
        <li><a routerLink="/docs/actions">动作、事件与函数</a> —— event 与 functionCall、双向 RPC、@checks 校验与调用权限。</li>
        <li><a routerLink="/docs/inference">推理格式</a> —— 模型写的紧凑标记如何编译成线上消息,Express 的 token 收益。</li>
        <li><a routerLink="/docs/sdks">SDK 一览</a> —— Core / Agent / Renderer 三层包矩阵与一致性套件。</li>
        <li><a routerLink="/docs/glossary">术语表</a> —— 全部名词的字母序速查。</li>
        <li><a routerLink="/docs/security">安全模型</a> —— 白名单护栏、NoAI 数据与漏洞报告渠道。</li>
      </ul>
      <p>想直接动手,去<a routerLink="/docs/quickstart">快速开始</a>与<a routerLink="/docs/walkthrough">分步详解</a>;
      想看消息逐条驱动两个渲染器,去 <a routerLink="/playground">Playground</a>。</p>
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
}