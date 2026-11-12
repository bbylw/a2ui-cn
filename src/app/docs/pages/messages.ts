import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-messages',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="概念" heading="消息参考">
        A2UI 的全部通信都是异步 JSON 消息：智能体到渲染器六种，渲染器到智能体三种。
        本页覆盖 v1.0 的每个消息类型、字段与示例。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="envelope">消息信封</h2>
      <p>每条线上消息都是一个 JSON 对象，带 <code>version</code> 字段(v1.0 为 <code>"1.0"</code>)和恰好一个消息键：</p>
      <app-code lang="json" label="v1.0 消息信封" [code]="envelope" />
      <p>消息可以走任何传输：A2A、AG-UI、MCP、WebSocket、SSE、REST。除显式消息外,
      渲染器还可以在请求的传输元数据里附带能力声明与数据模型同步(见本页末尾)。</p>

      <h2 id="agent-to-renderer">智能体 → 渲染器</h2>

      <h3 id="createsurface">createSurface</h3>
      <p>开辟一块新界面。<code>surfaceId</code> 在渲染上下文(一个 MessageProcessor，通常是一段会话)内必须全局唯一。
      创建会隐式实例化保留的 Surface 容器，其 child 指向 "root"。</p>
      <table>
        <thead><tr><th scope="col">字段</th><th scope="col">类型</th><th scope="col">必填</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><code>surfaceId</code></td><td>string</td><td>是</td><td>surface 唯一标识。</td></tr>
          <tr><td><code>catalogId</code></td><td>string</td><td>v1.0 可选</td><td>默认目录。v1.0 中组件(<code>@catalogId</code>)与函数调用可各自指定目录。</td></tr>
          <tr><td><code>sendDataModel</code></td><td>boolean</td><td>否</td><td>为 true 时，渲染器在每条发给该智能体的消息元数据里附带完整数据模型。</td></tr>
          <tr><td><code>components</code></td><td>array</td><td>否</td><td>内联初始组件列表，一条消息完成创建。</td></tr>
          <tr><td><code>dataModel</code></td><td>object</td><td>否</td><td>内联初始数据模型。</td></tr>
          <tr><td><code>metadata</code></td><td>object</td><td>否</td><td>surface 级自定义扩展容器。</td></tr>
        </tbody>
      </table>
      <app-code lang="json" label="createSurface" [code]="createSurface" />

      <h3 id="updatecomponents">updateComponents</h3>
      <p>向已有 surface 添加或替换组件定义。组件是扁平邻接表，用 id 互相引用，必须存在 <code>id: "root"</code>。
      已存在的 id 会被新定义整体替换；未变化的兄弟子树保持焦点与本地状态。</p>
      <table>
        <thead><tr><th scope="col">字段</th><th scope="col">类型</th><th scope="col">必填</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><code>surfaceId</code></td><td>string</td><td>是</td><td>目标 surface。</td></tr>
          <tr><td><code>components</code></td><td>array</td><td>是</td><td>非空组件数组；每个组件可带 <code>@metadata.extensions</code> 扩展。</td></tr>
        </tbody>
      </table>
      <app-code lang="json" label="updateComponents" [code]="updateComponents" />

      <h3 id="updatedatamodel">updateDataModel</h3>
      <p>用 RFC 6901 JSON Pointer 定点更新数据模型，绑定到该位置的组件自动刷新，无需重发组件。</p>
      <table>
        <thead><tr><th scope="col">字段</th><th scope="col">类型</th><th scope="col">必填</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><code>surfaceId</code></td><td>string</td><td>是</td><td>目标 surface。</td></tr>
          <tr><td><code>path</code></td><td>string</td><td>否</td><td>JSON Pointer，如 <code>/selectedFlight</code>；省略或 <code>"/"</code> 表示替换整个数据模型。</td></tr>
          <tr><td><code>value</code></td><td>any</td><td>是</td><td>写入的值；<code>null</code> 表示删除该键。</td></tr>
        </tbody>
      </table>
      <app-code lang="json" label="updateDataModel:写入与删除" [code]="updateDataModel" />

      <h3 id="deletesurface">deleteSurface</h3>
      <p>卸载 surface，释放其组件树与数据模型。只需要 <code>surfaceId</code>:</p>
      <app-code lang="json" label="deleteSurface" [code]="deleteSurface" />

      <h3 id="callrendererfunction">callRendererFunction</h3>
      <p>智能体发起的 RPC:让渲染器执行目录里注册的客户端函数(如读取设备时区)。
      只有 <code>allowedCallers</code> 为 <code>agentOnly</code> 或 <code>rendererOrAgent</code> 的函数可以被这样调用。</p>
      <table>
        <thead><tr><th scope="col">字段</th><th scope="col">类型</th><th scope="col">必填</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><code>functionCallId</code></td><td>string</td><td>是</td><td>关联 id，原样出现在响应里。</td></tr>
          <tr><td><code>callFunction</code></td><td>object</td><td>是</td><td>FunctionCall:<code>@call</code> 函数名、<code>catalogId</code>、可选 <code>args</code>。</td></tr>
          <tr><td><code>surfaceId</code></td><td>string</td><td>否</td><td>提供求值上下文的 surface；省略则在空上下文执行。</td></tr>
        </tbody>
      </table>
      <app-code lang="json" label="callRendererFunction" [code]="callRendererFunction" />

      <h3 id="agentfunctionresponse">agentFunctionResponse</h3>
      <p>智能体对渲染器 <code>callAgentFunction</code> 的应答。<code>functionCallId</code> 对应请求;
      成功带 <code>value</code>，失败带 <code>error</code>(含 <code>code</code> 与 <code>message</code>),两者互斥：</p>
      <app-code lang="json" label="agentFunctionResponse" [code]="agentFunctionResponse" />

      <h2 id="renderer-to-agent">渲染器 → 智能体</h2>

      <h3 id="action">action</h3>
      <p>用户触发了组件上声明的事件动作(如点击配置了 <code>action.event</code> 的 Button)。
      发送前，渲染器已把 context 与 userMessage 里的绑定解析为本地数据模型中的实际值。</p>
      <table>
        <thead><tr><th scope="col">字段</th><th scope="col">类型</th><th scope="col">必填</th><th scope="col">说明</th></tr></thead>
        <tbody>
          <tr><td><code>name</code></td><td>string</td><td>是</td><td>组件上声明的事件名。</td></tr>
          <tr><td><code>surfaceId</code></td><td>string</td><td>是</td><td>交互发生的 surface。</td></tr>
          <tr><td><code>sourceComponentId</code></td><td>string</td><td>是</td><td>触发动作的组件 id。</td></tr>
          <tr><td><code>userMessage</code></td><td>string</td><td>否</td><td>声明了 userMessage 时，作为用户话语送回对话。</td></tr>
          <tr><td><code>context</code></td><td>object</td><td>否</td><td>绑定已解析的事件上下文。</td></tr>
          <tr><td><code>timestamp</code></td><td>string</td><td>否</td><td>交互时间。</td></tr>
        </tbody>
      </table>
      <app-code lang="json" label="action" [code]="actionMsg" />

      <h3 id="callagentfunction">callAgentFunction</h3>
      <p>渲染器请求智能体侧执行目录中声明的函数，携带 <code>functionCallId</code> 与 FunctionCall;
      智能体以 <code>agentFunctionResponse</code> 应答。适合把「查行李额度」这类服务端能力暴露给界面。</p>

      <h3 id="rendererfunctionresponse">rendererFunctionResponse</h3>
      <p>渲染器对 <code>callRendererFunction</code> 的应答，结构与 agentFunctionResponse 对称:
      <code>functionCallId</code> 加 <code>value</code> 或 <code>error</code>。</p>

      <h2 id="metadata">传输元数据</h2>
      <p>除显式消息外，渲染器在发往智能体的请求里附带两类元数据：</p>
      <ul>
        <li><code>a2uiRendererCapabilities</code>:渲染器支持的目录与协议版本，供智能体做目录协商。</li>
        <li><code>a2uiRendererDataModel</code>:当 surface 声明 <code>sendDataModel: true</code> 时，每条消息都附带该 surface 的完整数据模型，让智能体始终看到最新状态。</li>
      </ul>

      <h2 id="v09">与 v0.9.1 的差异</h2>
      <table>
        <thead><tr><th scope="col">项目</th><th scope="col">v0.9.1</th><th scope="col">v1.0</th></tr></thead>
        <tbody>
          <tr><td>version 字段</td><td><code>"v0.9"</code></td><td><code>"1.0"</code></td></tr>
          <tr><td>数据绑定</td><td><code>&#123;"path": "/x"&#125;</code></td><td><code>&#123;"@path": "/x"&#125;</code></td></tr>
          <tr><td>createSurface.catalogId</td><td>必填</td><td>可选，组件/函数可各自指定</td></tr>
          <tr><td>内联 components / dataModel</td><td>不支持</td><td>支持单消息初始化</td></tr>
          <tr><td>updateDataModel.value</td><td>可选，省略即删除</td><td>必填，<code>null</code> 即删除</td></tr>
          <tr><td>theme 属性</td><td>createSurface.theme</td><td>移除，由宿主应用样式接管</td></tr>
          <tr><td>双向函数 RPC</td><td>无</td><td>callRendererFunction / callAgentFunction 及应答</td></tr>
        </tbody>
      </table>
      <p>官方 TypeScript 与 Python Core SDK 同时支持 v0.8、v0.9.1 与 v1.0 信封，迁移可以渐进进行。
      完整规范见 <a href="https://a2ui.org/specification/v1.0-a2ui/" target="_blank" rel="noopener">a2ui.org 的 v1.0 specification</a>,
      组件字段细节见<a routerLink="/docs/concepts">核心概念</a>。</p>
    </div>
  `,
})
export class MessagesPage {
  protected readonly envelope = `{
  "version": "1.0",
  "updateDataModel": {
    "surfaceId": "flight_search",
    "path": "/selectedFlight",
    "value": {"flightId": "LH458", "status": "confirmed"}
  }
}`;

  protected readonly createSurface = `{
  "version": "1.0",
  "createSurface": {
    "surfaceId": "flight_search",
    "catalogId": "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json",
    "sendDataModel": false,
    "components": [
      {"id": "root", "component": "Column", "children": ["title", "flight_card"]},
      {"id": "title", "component": "Text", "text": "Available Flights"},
      {"id": "flight_card", "component": "Card", "child": "flight_info"},
      {"id": "flight_info", "component": "Text", "text": {"@path": "/flights/0/summary"}}
    ],
    "dataModel": {
      "flights": [{"summary": "LH458 · BER -> SFO · $680", "price": 680}]
    }
  }
}`;

  protected readonly updateComponents = `{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "flight_search",
    "components": [
      {"id": "root", "component": "Column", "children": ["header", "btn_select_lh458"]},
      {"id": "header", "component": "Text", "text": "Outbound Flights"},
      {"id": "btn_select_label", "component": "Text", "text": "Select LH458 ($680)"},
      {
        "id": "btn_select_lh458",
        "component": "Button",
        "child": "btn_select_label",
        "variant": "primary",
        "action": {
          "event": {
            "name": "select_flight",
            "userMessage": "Selected flight LH458",
            "context": {"flightId": "LH458", "price": {"@path": "/flights/0/price"}}
          }
        }
      }
    ]
  }
}`;

  protected readonly updateDataModel = `{
  "version": "1.0",
  "updateDataModel": {
    "surfaceId": "flight_search",
    "path": "/selectedFlight",
    "value": {"flightId": "LH458", "status": "confirmed", "passengers": 2}
  }
}

{
  "version": "1.0",
  "updateDataModel": {
    "surfaceId": "flight_search",
    "path": "/selectedFlight",
    "value": null
  }
}`;

  protected readonly deleteSurface = `{
  "version": "1.0",
  "deleteSurface": {"surfaceId": "flight_search"}
}`;

  protected readonly callRendererFunction = `{
  "version": "1.0",
  "callRendererFunction": {
    "surfaceId": "flight_search",
    "functionCallId": "call_tz_101",
    "callFunction": {
      "@call": "getDeviceTimezone",
      "catalogId": "device:sensors",
      "args": {}
    }
  }
}`;

  protected readonly agentFunctionResponse = `{
  "version": "1.0",
  "agentFunctionResponse": {
    "functionCallId": "call_baggage_202",
    "value": {"allowedBags": 2, "maxWeightKg": 23, "feePerExtraBag": 75}
  }
}`;

  protected readonly actionMsg = `{
  "version": "1.0",
  "action": {
    "name": "select_flight",
    "surfaceId": "flight_search",
    "sourceComponentId": "btn_select_lh458",
    "userMessage": "Selected flight LH458",
    "context": {"flightId": "LH458", "price": 680},
    "timestamp": "2026-11-12T08:30:00Z"
  }
}`;
}