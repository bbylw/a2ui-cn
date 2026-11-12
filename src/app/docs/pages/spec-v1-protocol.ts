import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-spec-v1-protocol',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="规范 v1.0 / 协议规范" heading="协议规范(v1.0)">
        v1.0 是当前版本。本页是协议规范的中文参考:信封、消息字段、surface 生命周期、
        组件模型、绑定与错误码。概念解释见<a routerLink="/docs/concepts">核心概念</a>,
        逐字段示例见<a routerLink="/docs/messages">消息参考</a>,原文见
        <a href="https://a2ui.org/specification/v1.0-a2ui/" target="_blank" rel="noopener">官方 Protocol Specification</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="envelope">信封</h2>
      <p>每条智能体流式消息都是一个 JSON 对象:带 <code>version: "1.0"</code>,
      且恰好包含六个键之一:<code>createSurface</code>、<code>updateComponents</code>、<code>updateDataModel</code>、
      <code>deleteSurface</code>、<code>callRendererFunction</code>、<code>agentFunctionResponse</code>。
      信封与目录无关:组件的基础属性对照 <code>ComponentCommon</code> 校验,组件本体对照
      <code>catalog.json#/$defs/anyComponent</code> 校验,校验时把 <code>catalog.json</code> 映射到实际目录。
      一轮智能体回合的结束由传输层信号表示,不属于协议消息。</p>
      <app-code lang="json" label="最小信封示例" [code]="envelopeJson" />

      <h2 id="agent-messages">智能体 → 渲染器</h2>
      <table>
        <thead><tr><th scope="col">消息</th><th scope="col">必填</th><th scope="col">可选与语义</th></tr></thead>
        <tbody>
          <tr><td><code>createSurface</code></td><td><code>surfaceId</code></td><td><code>catalogId</code>(surface 默认目录)、<code>sendDataModel</code>(默认 false)、<code>components</code>(初始树)、<code>dataModel</code>(初始模型)、<code>metadata.extensions</code>。隐式实例化规范 <code>Surface</code> 容器(<code>child: "root"</code>);v1.0 不接受 <code>theme</code>。两者同时存在时先应用数据模型。</td></tr>
          <tr><td><code>updateComponents</code></td><td><code>surfaceId</code>、<code>components</code></td><td>扁平邻接表;<code>id: "root"</code> 的组件挂到 Surface 下。surface 创建前不允许发送;缺失引用渲染为占位。</td></tr>
          <tr><td><code>updateDataModel</code></td><td><code>surfaceId</code>、<code>value</code></td><td><code>path</code>(JSON Pointer,默认 <code>/</code>)。upsert 语义;<code>null</code> 删除键;省略 path 或 <code>/</code> 替换整个模型。</td></tr>
          <tr><td><code>deleteSurface</code></td><td><code>surfaceId</code></td><td>移除 surface 及其组件与数据。</td></tr>
          <tr><td><code>callRendererFunction</code></td><td><code>functionCallId</code>、<code>callFunction</code></td><td><code>surfaceId</code> 可选(省略时在隔离的空根模型 <code>&#123;&#125;</code> 中求值)。<code>callFunction</code> 含 <code>@call</code>、<code>catalogId</code>(必填)、<code>args</code>。仅 <code>allowedCallers</code> 为 <code>agentOnly</code> / <code>rendererOrAgent</code> 的函数可被调用;渲染器必须回 <code>rendererFunctionResponse</code>,即使返回 void。</td></tr>
          <tr><td><code>agentFunctionResponse</code></td><td><code>functionCallId</code></td><td><code>value</code> 与 <code>error</code>(<code>code</code> + <code>message</code>)恰好其一。</td></tr>
        </tbody>
      </table>

      <h2 id="renderer-messages">渲染器 → 智能体</h2>
      <table>
        <thead><tr><th scope="col">消息</th><th scope="col">语义</th></tr></thead>
        <tbody>
          <tr><td><code>action</code></td><td>用户交互派发:<code>name</code>、<code>surfaceId</code>、<code>sourceComponentId</code>、<code>timestamp</code>,可选 <code>userMessage</code>(DynamicString)、<code>context</code>、<code>metadata</code>。</td></tr>
          <tr><td><code>callAgentFunction</code></td><td>渲染器发起的函数调用,以 <code>functionCallId</code> 关联响应。</td></tr>
          <tr><td><code>rendererFunctionResponse</code></td><td><code>functionCallId</code> + <code>value</code> / <code>error</code> 恰好其一。</td></tr>
          <tr><td><code>error</code></td><td>渲染器错误;<code>functionCallId</code> 与 <code>surfaceId</code> 互斥。</td></tr>
        </tbody>
      </table>
      <p>开启 <code>sendDataModel</code> 后,每条渲染器出站消息附带完整数据模型(按 <code>surfaceId</code> 标记,
      schema 为 <code>renderer_data_model.json</code>),只投递给拥有该 surface 的智能体。</p>

      <h2 id="lifecycle">surface 生命周期</h2>
      <ul>
        <li><code>createSurface</code> 必须先于 <code>updateComponents</code> / <code>updateDataModel</code>。</li>
        <li><code>surfaceId</code> 在渲染器生命周期内全局唯一;重复创建是 <code>INTEGRITY_ERROR</code>(编排器可加前缀或 UUID)。</li>
        <li><code>surfaceId</code> 与默认 <code>catalogId</code> 创建后固定;要改只能删除重建。</li>
        <li>规范 <code>Surface</code> 容器不能通过 <code>updateComponents</code> 修改。</li>
        <li>恰好一个 <code>root</code> 组件;<code>root</code> 到达前的更新被缓冲,不产生可见效果。</li>
      </ul>

      <h2 id="transport">传输契约与流式</h2>
      <ul>
        <li>传输必须保证:按序可靠投递、消息 framing(JSONL / WebSocket 帧 / SSE)、元数据支持;可选双向返回通道。</li>
        <li>渲染器把流中每个 JSON 对象当作独立消息,渐进渲染:未解析的路径与引用渲染为空或占位,而不是报错。</li>
        <li>批量消息按到达顺序派发;同步 surface 变更先于其后的 RPC 信封生效;异步函数执行不阻塞后续信封。</li>
        <li>官方绑定:AG-UI、A2A、MCP;其余传输只要满足契约即可。</li>
      </ul>

      <h2 id="component">组件模型</h2>
      <p>UI 是邻接表:组件对象带 <code>id</code>、<code>component</code> 与目录属性,父子关系用 id 引用,
      渲染器维护 id → 组件映射并在渲染时重建树。组合校验规则:</p>
      <ul>
        <li>目录可声明 <code>allowedParents</code> / <code>allowedChildren</code>;违规放置报 <code>UNALLOWED_PARENT</code> / <code>UNALLOWED_CHILD</code>。</li>
        <li>标识符遵循 UAX #31:<code>^[\\p&#123;XID_Start&#125;_][\\p&#123;XID_Continue&#125;]*$</code>;<code>Surface</code> 是保留类型,目录不得定义。</li>
        <li>单 <code>@</code> 前缀键为协议保留;字面 <code>@</code> 键用双写转义(<code>@@path</code> → <code>@path</code>);未知单 <code>@</code> 键必须拒绝。</li>
      </ul>

      <h2 id="binding">绑定与作用域</h2>
      <p>动态值接受字面量、<code>&#123;"@path": "..."&#125;</code>(JSON Pointer)或 <code>&#123;"@call": "...", "args": &#123;...&#125;&#125;</code>;
      <code>ChildList</code> 支持静态 id 数组或 <code>&#123;componentId, path&#125;</code> 模板。绝对路径以 <code>/</code> 开头,
      相对路径在集合模板作用域内解析。输入组件双向绑定本地模型,首次写入即创建路径,action 触发前不发往智能体。
      完整规则与示例见<a routerLink="/docs/data-binding">数据模型与绑定</a>。</p>

      <h2 id="errors">错误码</h2>
      <table>
        <thead><tr><th scope="col">码</th><th scope="col">含义</th></tr></thead>
        <tbody>
          <tr><td><code>INTEGRITY_ERROR</code></td><td>surface 重复创建等完整性违规。</td></tr>
          <tr><td><code>INVALID_FUNCTION_CALL</code></td><td>未知 surface / 未注册目录 / 越权调用 / 参数 schema 不符 / 缺少 catalogId。</td></tr>
          <tr><td><code>EXECUTION_ERROR</code></td><td>函数执行失败,如模板外使用 <code>@index</code>。</td></tr>
          <tr><td><code>EXPRESSION_ERROR</code></td><td>表达式违规:被动绑定或 CheckRule 条件引用 <code>requiresUserActivation</code> 函数、不安全 regex 等。</td></tr>
          <tr><td><code>UNALLOWED_PARENT</code> / <code>UNALLOWED_CHILD</code></td><td>违反目录声明的放置规则。</td></tr>
          <tr><td><code>VALIDATION_FAILED</code></td><td>组件校验失败(渲染器 error 消息)。</td></tr>
        </tbody>
      </table>
      <p>错误对象统一为 <code>code</code> + <code>message</code>。<code>agentOnly</code> 函数不得绑定到组件属性或经 UI action 执行;
      <code>requiresUserActivation</code> 函数只能在用户手势内的 action 中运行。</p>

      <h2 id="loop">提示-生成-校验循环</h2>
      <p>Agent SDK 在服务端维护 surface 状态,对每条出站消息做有状态校验;失败以标准错误格式返回给模型自纠,
      而不是把坏消息发给客户端:</p>
      <app-code lang="json" label="标准校验错误格式" [code]="validationErrorJson" />

      <h2 id="capabilities">能力与元数据</h2>
      <ul>
        <li>智能体能力:<code>supportedCatalogIds</code>、<code>acceptsInlineCatalogs</code>(默认 false)。</li>
        <li>渲染器能力:<code>supportedCatalogIds</code>(必填)、<code>inlineCatalogs</code>(仅当智能体接受时提供)。</li>
        <li>能力经传输元数据或握手交换(A2A Agent Card、MCP initialization);所有在用目录必须同一 A2UI 规范版本。</li>
        <li>目录解析顺序:组件 <code>@catalogId</code> / 调用 <code>catalogId</code> → surface 默认 → 报错;不回退到能力里广告的其他目录。</li>
      </ul>
      <p>schema 文件清单见<a routerLink="/docs/spec-v1-schemas">JSON Schema</a>;
      从 v0.9.1 迁移见<a routerLink="/docs/spec-v1-evolution">演进指南</a>。</p>
    </div>
  `,
})
export class SpecV1ProtocolPage {
  protected readonly envelopeJson = `{
  "version": "1.0",
  "createSurface": {
    "surfaceId": "trip",
    "catalogId": "https://example.com/catalogs/travel/v1",
    "sendDataModel": true,
    "dataModel": {"flights": []}
  }
}`;
  protected readonly validationErrorJson = `{
  "code": "VALIDATION_FAILED",
  "message": "Component 'fare' references unknown component 'FlightOptionX' in catalog 'travel'",
  "surfaceId": "trip",
  "path": "/components/3"
}`;
}