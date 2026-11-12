import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-spec-v091-schemas',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="规范 v0.9.1" heading="JSON Schema(v0.9.1)">
        v0.9.1 由 10 份规范 JSON Schema 定义 wire 消息、共享类型、数据模型与能力协商，源码位于仓库
        <code>specification/v0_9_1/json/</code>。为兼容旧实现，<code>$id</code> 保留
        <code>https://a2ui.org/specification/v0_9/&lt；文件名&gt;</code>(是 <code>v0_9</code> 而非 <code>v0_9_1</code>),
        使用 JSON Schema draft 2020-12。原文见
        <a href="https://a2ui.org/specification/v0.9.1/schemas/" target="_blank" rel="noopener">官方 v0.9.1 JSON Schemas</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="wire">wire 消息</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>server_to_client.json</code></td><td>服务器出站信封。顶层 <code>oneOf</code> 覆盖四种消息(CreateSurface / UpdateComponents / UpdateDataModel / DeleteSurface),每条要求 <code>version</code>(枚举 <code>"v0.9"</code> / <code>"v0.9.1"</code>)加消息键，<code>additionalProperties: false</code>。createSurface 必填 surfaceId 与 catalogId，可选 theme(引用 <code>catalog.json#/$defs/theme</code>)与 sendDataModel(默认 false);updateComponents 的 components 至少一项且必须含 <code>id: "root"</code>;updateDataModel 的 path 与 value 均可选，省略 value 即删除该键。</td></tr>
          <tr><td><code>client_to_server.json</code></td><td>客户端出站事件，恰好两个属性：<code>version</code> 加 <code>action</code> 或 <code>error</code> 之一。action 必填 name、surfaceId、sourceComponentId、timestamp(date-time)与 context(允许附加属性)。error 是 oneOf:VALIDATION_FAILED(必填 code / path / message / surfaceId，不允许附加属性)或通用错误(code 非 VALIDATION_FAILED，必填 surfaceId / message，允许附加属性)。</td></tr>
        </tbody>
      </table>

      <h2 id="shared">共享类型与数据模型</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>common_types.json</code></td><td>14 个共享 <code>$defs</code>:ComponentId、AccessibilityAttributes(label / description，均动态字符串)、ComponentCommon(id 必填 + accessibility)、ChildList(id 数组或 <code>&#123;componentId, path&#125;</code> 模板)、DataBinding(必填 path)、DynamicValue / DynamicString / DynamicNumber / DynamicBoolean / DynamicStringList、FunctionCall、CheckRule(condition + message)、Checkable(checks 数组)、Action。FunctionCall 必填 call，可选 args 与 returnType(默认 boolean),且须满足 <code>catalog.json#/$defs/anyFunction</code>;Action 是 event(name + context)或 functionCall 的 oneOf。</td></tr>
          <tr><td><code>client_data_model.json</code></td><td>数据模型同步载体：必填 <code>version</code> 与 <code>surfaces</code>(surfaceId → 任意 JSON 对象),放在 A2A 元数据的 <code>a2uiClientDataModel</code> 字段。</td></tr>
        </tbody>
      </table>

      <h2 id="caps">能力</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>server_capabilities.json</code></td><td>服务器广告的能力，可嵌入 A2A Agent Card 的扩展 <code>params</code>。必填以 <code>"v0.9"</code> 为键的对象，内含可选 supportedCatalogIds 与 acceptsInlineCatalogs(默认 false)。</td></tr>
          <tr><td><code>client_capabilities.json</code></td><td>客户端渲染能力，经 A2A 元数据 <code>a2uiClientCapabilities</code> 发送。必填 <code>"v0.9"</code> 键，其中 supportedCatalogIds 必填、inlineCatalogs 可选(仅当服务器接受时提供)。内嵌 <code>$defs</code>:FunctionDefinition(name、parameters(JSON Schema)、returnType 必填)与 Catalog(catalogId 必填，可选 components / functions / theme)。</td></tr>
        </tbody>
      </table>

      <h2 id="batch">批量与包装</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>server_to_client_list.json</code></td><td>服务器消息数组。</td></tr>
          <tr><td><code>client_to_server_list.json</code></td><td>客户端消息数组。</td></tr>
          <tr><td><code>server_to_client_list_wrapper.json</code></td><td>以必填 <code>messages</code> 属性包装上表数组(<code>additionalProperties: false</code>),供要求顶层为对象的协议使用。</td></tr>
          <tr><td><code>client_to_server_list_wrapper.json</code></td><td>客户端方向的同型包装。</td></tr>
        </tbody>
      </table>

      <h2 id="rename">与 v1.0 文件的对照</h2>
      <p>v1.0 把术语从 client / server 改为 renderer / agent，文件随之改名，并新增第 11 份
      <code>catalog_definition.json</code>(目录结构独立成 schema):</p>
      <table>
        <thead><tr><th scope="col">v0.9.1</th><th scope="col">v1.0</th></tr></thead>
        <tbody>
          <tr><td><code>server_to_client.json</code></td><td><code>agent_to_renderer.json</code></td></tr>
          <tr><td><code>client_to_server.json</code></td><td><code>renderer_to_agent.json</code></td></tr>
          <tr><td><code>common_types.json</code></td><td><code>common_types.json</code>(扩充)</td></tr>
          <tr><td><code>client_data_model.json</code></td><td><code>renderer_data_model.json</code></td></tr>
          <tr><td><code>server_capabilities.json</code></td><td><code>agent_capabilities.json</code></td></tr>
          <tr><td><code>client_capabilities.json</code></td><td><code>renderer_capabilities.json</code></td></tr>
          <tr><td><code>server_to_client_list.json</code></td><td><code>agent_to_renderer_list.json</code></td></tr>
          <tr><td><code>client_to_server_list.json</code></td><td><code>renderer_to_agent_list.json</code></td></tr>
          <tr><td><code>server_to_client_list_wrapper.json</code></td><td><code>agent_to_renderer_list_wrapper.json</code></td></tr>
          <tr><td><code>client_to_server_list_wrapper.json</code></td><td><code>renderer_to_agent_list_wrapper.json</code></td></tr>
          <tr><td>—</td><td><code>catalog_definition.json</code>(新增)</td></tr>
        </tbody>
      </table>

      <h2 id="rules">引用与校验规则</h2>
      <ul>
        <li>schema 之间用相对文件名互引，如 <code>common_types.json#/$defs/ComponentCommon</code>、<code>catalog.json#/$defs/anyComponent</code>。</li>
        <li><code>catalog.json</code> 是占位名：校验时映射到实际目录 schema；基础目录的参考 schema(<code>basic_catalog.json</code>)随<a routerLink="/docs/spec-v091-catalog">v0.9.1 基础目录指南</a>发布，不在 10 份之内。</li>
        <li>版本字段同时接受 <code>"v0.9"</code> 与 <code>"v0.9.1"</code>，两版载荷完全兼容，见<a routerLink="/docs/spec-v091-evolution">演进指南</a>。</li>
        <li>目录应同时设置 <code>$id</code> 与 <code>catalogId</code> 为同一 URI；基础目录保留 <code>v0_9</code> 目录 URI。</li>
      </ul>
      <app-code lang="json" label="v0.9.1 信封示例" [code]="envelopeJson" />
      <p>消息语义见<a routerLink="/docs/spec-v091-protocol">v0.9.1 协议规范</a>;
      当前版本的对应文件见<a routerLink="/docs/spec-v1-schemas">v1.0 JSON Schema</a>。</p>
    </div>
  `,
})
export class SpecV091SchemasPage {
  protected readonly envelopeJson = `{
  "version": "v0.9.1",
  "createSurface": {
    "surfaceId": "booking",
    "catalogId": "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json",
    "sendDataModel": true
  }
}`;
}