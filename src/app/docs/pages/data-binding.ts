import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-data-binding',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="概念" heading="数据模型与绑定">
        每个 surface 带一个隔离的 JSON 数据模型。组件结构只声明一次，运行时数据靠绑定流动：
        数据变化时只有绑定到该路径的组件刷新，输入框的编辑先写本地、再按需同步给智能体。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="model">填充数据模型</h2>
      <p>v1.0 的 <code>createSurface</code> 可以内联 <code>dataModel</code> 一次完成初始化；
      之后用 <code>updateDataModel</code> 增量写入。路径是 RFC 6901 JSON Pointer，语义是 upsert：
      缺失的中间对象自动创建，已有的值被替换：</p>
      <app-code lang="json" label="updateDataModel 增量写入" [code]="updateJson" />
      <ul>
        <li>省略 <code>path</code> 或设为 <code>"/"</code>：替换整个根数据模型。</li>
        <li>删除一个键：v1.0 设 <code>"value": null</code>；v0.9.1 省略 <code>value</code>。</li>
        <li>v0.9.1 的 <code>createSurface</code> 不能内联数据，一律走 <code>updateDataModel</code>。</li>
      </ul>

      <h2 id="path">绑定：@path 与 path</h2>
      <p>组件的动态属性可以是字面量，也可以是绑定。v1.0 用保留键 <code>@path</code>，
      v0.9.1 用普通键 <code>path</code>。<code>@</code> 前缀是为了不让普通 JSON 里恰好叫
      <code>path</code> 的业务属性被误认为绑定。显示类组件是单向响应式绑定：</p>
      <app-code lang="json" label="Text 绑定数据模型" [code]="bindJson" />
      <p>注意两个固定 schema 字段不带 <code>@</code>：<code>updateDataModel.path</code> 与
      列表模板的 <code>path</code>，它们是消息结构的一部分，不是绑定。</p>

      <h2 id="twoway">双向绑定：输入组件</h2>
      <p>TextField、Slider、CheckBox 等输入组件的绑定是双向的：用户编辑立即写回本地数据模型，
      不产生逐键的网络往返。绑定到同一路径的其他组件（比如一个实时预览的 Text）同步刷新：</p>
      <app-code lang="json" label="TextField 双向绑定" [code]="inputJson" />

      <h2 id="lists">动态列表：模板与相对路径</h2>
      <p>容器的 <code>children</code> 除了静态 id 数组，还可以是模板对象
      <code>&#123;"path": "/guests", "componentId": "guestRow"&#125;</code>:
      数组有几个元素就实例化几次模板，并为每次实例化建立集合作用域。
      模板内部不带前导斜杠的 <code>@path</code> 解析到当前元素：</p>
      <app-code lang="json" label="ChildList 模板（v1.0）" [code]="listJson" />
      <p>上例中 <code>"name"</code> 分别解析为 <code>/guests/0/name</code>、<code>/guests/1/name</code>。
      系统函数 <code>@index</code> 返回当前元素的 0 起始下标，可加 <code>offset</code>：
      <code>&#123;"@call": "@index", "args": &#123;"offset": 1&#125;&#125;</code>。
      嵌套模板解析到最内层；在模板外调用会报 <code>EXPRESSION_ERROR</code>。</p>

      <h2 id="events">在事件里引用数据</h2>
      <p>事件的 <code>context</code> 里可以放绑定，渲染器在发出 action 前解析成具体值。
      这是把本地编辑结果交给智能体的默认通道：</p>
      <app-code lang="json" label="Button 事件携带绑定" [code]="eventJson" />
      <app-code lang="json" label="解析后发出的 action 消息" [code]="actionJson" />

      <h2 id="sync">把状态同步回智能体</h2>
      <p>本地数据模型默认留在渲染侧，有三条通道把它交给智能体：</p>
      <ul>
        <li><strong>事件 context。</strong>按需挑选字段，随 action 发送，最常用。</li>
        <li><strong>智能体函数参数。</strong><code>action.functionCall</code> 的 args 里放绑定，
          经 <code>callAgentFunction</code> 路由到智能体执行。</li>
        <li><strong>sendDataModel: true。</strong>创建 surface 时开启后，每次出站消息的传输 metadata
          都附带完整数据模型，键为 <code>a2uiRendererDataModel</code>(v0.9.1 为
          <code>a2uiClientDataModel</code>)，形如
          <code>&#123;"version": "1.0", "surfaces": &#123;"booking": &#123;...&#125;&#125;&#125;</code>。
          适合需要全量表单状态的智能体，代价是每轮都传全量。</li>
      </ul>
      <app-code lang="json" label="开启全量数据模型同步" [code]="sendJson" />
      <p>涉及支付信息、凭据等「NoAI」数据时，不要放进 event context、智能体函数参数或开启
      sendDataModel 的 surface，详见<a routerLink="/docs/security">安全模型</a>。</p>

      <h2 id="read">在代码里读数据模型</h2>
      <p>各语言 SDK 都暴露按指针读取的接口：</p>
      <app-code lang="ts" label="TypeScript" [code]="getTs" />
      <app-code lang="python" label="Python" [code]="getPy" />
      <p>绑定与消息字段的完整定义见<a routerLink="/docs/messages">消息参考</a>与
      <a href="https://a2ui.org/concepts/data-binding/" target="_blank" rel="noopener">官方 Data Binding 文档</a>。</p>
    </div>
  `,
})
export class DataBindingPage {
  protected readonly updateJson = `{
  "version": "1.0",
  "updateDataModel": {
    "surfaceId": "booking",
    "path": "/reservation/destination",
    "value": "Kyoto, Japan"
  }
}`;

  protected readonly bindJson = `{
  "id": "destinationText",
  "component": "Text",
  "text": {"@path": "/reservation/destination"}
}`;

  protected readonly inputJson = `{
  "id": "emailInput",
  "component": "TextField",
  "label": "Guest Email",
  "value": {"@path": "/reservation/guestEmail"}
}`;

  protected readonly listJson = `[
  {
    "version": "1.0",
    "updateDataModel": {
      "surfaceId": "booking",
      "path": "/guests",
      "value": [{"name": "Alex Rivera"}, {"name": "Sam Taylor"}]
    }
  },
  {
    "version": "1.0",
    "updateComponents": {
      "surfaceId": "booking",
      "components": [
        {
          "id": "root",
          "component": "Column",
          "children": {"path": "/guests", "componentId": "guestRow"}
        },
        {"id": "guestRow", "component": "Text", "text": {"@path": "name"}}
      ]
    }
  }
]`;

  protected readonly eventJson = `{
  "id": "submitButton",
  "component": "Button",
  "child": "submitLabel",
  "action": {
    "event": {
      "name": "submit_reservation",
      "context": {"email": {"@path": "/reservation/guestEmail"}}
    }
  }
}`;

  protected readonly actionJson = `{
  "version": "1.0",
  "action": {
    "name": "submit_reservation",
    "surfaceId": "booking",
    "sourceComponentId": "submitButton",
    "timestamp": "2026-03-15T14:30:00Z",
    "context": {"email": "alex@example.com"}
  }
}`;

  protected readonly sendJson = `{
  "version": "1.0",
  "createSurface": {
    "surfaceId": "booking",
    "catalogId": "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json",
    "sendDataModel": true
  }
}`;

  protected readonly getTs = `const surface = processor.model.getSurface('booking');
const email = surface?.dataModel.get('/reservation/guestEmail');`;

  protected readonly getPy = `surface = processor.model.get_surface("booking")
email = surface.data_model.get("/reservation/guestEmail") if surface else None`;
}