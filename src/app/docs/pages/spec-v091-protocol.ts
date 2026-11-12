import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-spec-v091-protocol',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="规范 v0.9.1 / 协议规范" heading="协议规范(v0.9.1)">
        v0.9.1 是上一代版本(状态 Closed),取代 v0.9 并只做小幅 schema 修订;新项目应面向 v1.0。
        本页记录 v0.9.1 的信封、绑定语法与消息字段,并标出与 v1.0 的差异。原文见
        <a href="https://a2ui.org/specification/v0.9.1-a2ui/" target="_blank" rel="noopener">官方 v0.9.1 Protocol Specification</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="envelope">信封与消息</h2>
      <p>信封带顶层 <code>version</code>(示例为 <code>"v0.9.1"</code>;为兼容,wire 示例与 <code>$id</code> URI 保留 <code>v0.9</code> / <code>v0_9</code>)。
      每条消息恰好一个键,共四种:</p>
      <table>
        <thead><tr><th scope="col">消息</th><th scope="col">字段与语义</th></tr></thead>
        <tbody>
          <tr><td><code>createSurface</code></td><td><code>surfaceId</code> 与 <code>catalogId</code> <strong>都必填</strong>;可选 <code>theme</code>、<code>sendDataModel</code>(默认 false)。创建后两者固定,改配置需删除重建。</td></tr>
          <tr><td><code>updateComponents</code></td><td><code>surfaceId</code> + <code>components</code>(扁平邻接表);恰好一个组件 <code>id: "root"</code>。</td></tr>
          <tr><td><code>updateDataModel</code></td><td><code>surfaceId</code>、可选 <code>path</code>(JSON Pointer,默认 <code>/</code>)、<strong>可选</strong> <code>value</code>:省略 value 即删除该键(v1.0 改为必填 + null 删除)。</td></tr>
          <tr><td><code>deleteSurface</code></td><td><code>surfaceId</code>。</td></tr>
        </tbody>
      </table>

      <h2 id="binding">绑定语法</h2>
      <p>数据绑定是 <code>&#123;"path": "..."&#125;</code> 对象(不是 v1.0 的 <code>@path</code>,也不是内联 <code>\$&#123;...&#125;</code> 字符串);
      函数调用是 <code>&#123;"call": "...", "args": &#123;...&#125;&#125;</code>;校验规则放在裸 <code>checks</code> 数组(<code>call</code> + <code>args</code> + <code>message</code>)。
      唯一的字符串插值机制是 <code>formatString</code> 函数:<code>\$&#123;...&#125;</code> 内放 JSON Pointer 路径或 <code>()</code> 函数调用,字面 <code>\$&#123;</code> 用 <code>\\\$&#123;</code> 转义。</p>
      <app-code lang="json" label="v0.9.1 组件与校验示例" [code]="componentJson" />
      <p>动态类型与 v1.0 同名:DynamicString / DynamicNumber / DynamicBoolean / DynamicStringList;
      容器用 ChildList(id 数组或 <code>&#123;componentId, path&#125;</code> 模板)。
      路径以 <code>/</code> 开头为绝对(根作用域);无前导斜杠在模板迭代作用域内解析
      (如 <code>/users</code> 迭代中的 <code>firstName</code> → <code>/users/0/firstName</code>);数组段非数字索引报错。</p>

      <h2 id="lifecycle">生命周期与同步</h2>
      <ul>
        <li><code>createSurface</code> → <code>updateComponents</code> / <code>updateDataModel</code> → <code>deleteSurface</code>;后两者要求 surface 已存在。</li>
        <li><code>surfaceId</code> 只需在<strong>当前活跃</strong> surface 中唯一(v1.0 收紧为渲染器生命周期内全局唯一);不删除就重复创建仍是错误。</li>
        <li><code>root</code> 到达前允许渐进渲染,更新被缓冲。</li>
        <li><code>updateDataModel</code> 为 upsert;数组省略 value 把该索引置 undefined 但保留长度。</li>
        <li><code>sendDataModel: true</code> 时客户端在 action 的传输元数据附完整数据模型;输入双向绑定只写本地,击键不发网络请求。</li>
      </ul>

      <h2 id="client-messages">客户端 → 服务器</h2>
      <ul>
        <li><code>action</code>:<code>name</code>、<code>surfaceId</code>、<code>sourceComponentId</code>、<code>timestamp</code>(ISO 8601)、<code>context</code>。
        组件侧用 <code>action.event</code>(name + 可选 context)发服务器事件,或 <code>action.functionCall</code> 调本地函数。</li>
        <li>能力与元数据走传输元数据而非一等消息:<code>supportedCatalogIds</code>(必填)、<code>inlineCatalogs</code>、
        <code>a2uiClientDataModel</code>(<code>surfaces</code> map)。</li>
        <li><code>error</code>:<code>code</code>(如 <code>VALIDATION_FAILED</code>)、<code>surfaceId</code>、<code>path</code>、<code>message</code>。</li>
      </ul>

      <h2 id="diff">与 v1.0 的关键差异</h2>
      <table>
        <thead><tr><th scope="col">主题</th><th scope="col">v0.9.1</th><th scope="col">v1.0</th></tr></thead>
        <tbody>
          <tr><td>术语</td><td>client / server</td><td>renderer / agent</td></tr>
          <tr><td>绑定 / 调用 / 校验</td><td><code>path</code> / <code>call</code> / <code>checks</code></td><td><code>@path</code> / <code>@call</code> / <code>@checks</code></td></tr>
          <tr><td>远程函数调用</td><td><code>callFunction</code>(单向)</td><td><code>callRendererFunction</code> + 响应;新增双向 <code>callAgentFunction</code> / <code>agentFunctionResponse</code></td></tr>
          <tr><td>createSurface</td><td>catalogId 必填、可带 theme</td><td>catalogId 可选、theme 移除、可内联 components / dataModel</td></tr>
          <tr><td>updateDataModel</td><td>value 可选,省略删除</td><td>value 必填,null 删除</td></tr>
          <tr><td>surfaceId 唯一性</td><td>活跃 surface 内唯一</td><td>渲染器生命周期内全局唯一</td></tr>
          <tr><td>模板索引</td><td>无内置</td><td><code>@index</code>(可选 offset)</td></tr>
        </tbody>
      </table>
      <p>完整迁移步骤见<a routerLink="/docs/spec-v1-evolution">v1.0 演进指南</a>;
      schema 文件与改名见<a routerLink="/docs/spec-v091-schemas">v0.9.1 JSON Schema</a>。</p>
    </div>
  `,
})
export class SpecV091ProtocolPage {
  protected readonly componentJson = `{
  "id": "email",
  "component": "TextField",
  "label": "邮箱",
  "value": {"path": "/contact/email"},
  "checks": [
    {"call": "required", "args": {"value": {"path": "/contact/email"}}, "message": "必填"},
    {"call": "email", "args": {"value": {"path": "/contact/email"}}, "message": "邮箱格式不正确"}
  ]
}`;
}