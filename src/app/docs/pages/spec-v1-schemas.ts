import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-spec-v1-schemas',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="规范 v1.0" heading="JSON Schema(v1.0)">
        v1.0 由 11 份规范 JSON Schema 定义,源码位于仓库 <code>specification/v1_0/json/</code>,
        <code>$id</code> 统一为 <code>https://a2ui.org/specification/v1_0/&lt;文件名&gt;</code>,
        使用 JSON Schema draft 2020-12。原文见
        <a href="https://a2ui.org/specification/v1.0/schemas/" target="_blank" rel="noopener">官方 JSON Schemas</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="wire">wire 消息</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>agent_to_renderer.json</code></td><td>智能体出站信封。顶层 <code>oneOf</code> 覆盖六种消息(CreateSurface / UpdateComponents / UpdateDataModel / DeleteSurface / CallRendererFunction / AgentFunctionResponse),全部要求 <code>version: "1.0"</code>。内嵌 <code>Component</code> 与 <code>ComponentsList</code>(至少一项);组件不得为 <code>"Surface"</code>。</td></tr>
          <tr><td><code>renderer_to_agent.json</code></td><td>渲染器出站事件。恰好两个属性:<code>version</code> 加 <code>action</code> / <code>callAgentFunction</code> / <code>rendererFunctionResponse</code> / <code>error</code> 之一。error 区分校验失败(VALIDATION_FAILED / UNALLOWED_PARENT / UNALLOWED_CHILD)与通用错误。</td></tr>
        </tbody>
      </table>

      <h2 id="shared">共享类型、目录与数据模型</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>common_types.json</code></td><td>跨 schema 共享定义:ComponentId、CallId、AccessibilityAttributes、Extensions、ComponentCommon、Child、ChildList、DataBinding、DynamicValue / DynamicString / DynamicNumber / DynamicBoolean / DynamicStringList、FunctionCommon、IndexSystemFunction、FunctionCall、CheckRule、Checkable、Action、Surface、FunctionResponse。保留 <code>Surface</code> 容器恒为 <code>child: "root"</code>。</td></tr>
          <tr><td><code>catalog_definition.json</code></td><td>目录结构:<code>catalogId</code>(必填)、<code>protocolVersion</code>(省略默认 "0.9")、<code>$defs</code>(必须含 anyComponent 与 anyFunction)、title / description / metadata.extensions / instructions / components / functions。FunctionDefinition 带 returnType、allowedCallers、requiresUserActivation;ComponentDefinition 带 allowedParents / allowedChildren。</td></tr>
          <tr><td><code>renderer_data_model.json</code></td><td>双向同步载体:所有活跃 surface 的数据模型,<code>version</code> + <code>surfaces</code>(surfaceId → 模型)。</td></tr>
        </tbody>
      </table>

      <h2 id="caps">能力</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>agent_capabilities.json</code></td><td>智能体广告的能力,可嵌入 A2A Agent Card 或 MCP 等传输。以 <code>"1.0"</code> 为键(必填),内含 supportedCatalogIds 与 acceptsInlineCatalogs(默认 false)。</td></tr>
          <tr><td><code>renderer_capabilities.json</code></td><td>渲染器能力,经 A2A 元数据发送。以 <code>"1.0"</code> 为键(必填),supportedCatalogIds 必填,inlineCatalogs 可选(仅当智能体接受时提供);inlineCatalogs 引用完整 catalog_definition.json。</td></tr>
        </tbody>
      </table>

      <h2 id="batch">批量与包装</h2>
      <table>
        <thead><tr><th scope="col">文件</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>agent_to_renderer_list.json</code></td><td>智能体消息数组。</td></tr>
          <tr><td><code>renderer_to_agent_list.json</code></td><td>渲染器消息数组。</td></tr>
          <tr><td><code>agent_to_renderer_list_wrapper.json</code></td><td>以必填 <code>messages</code> 属性包装上表数组,供要求顶层为对象的协议使用。</td></tr>
          <tr><td><code>renderer_to_agent_list_wrapper.json</code></td><td>渲染器方向的同型包装。</td></tr>
        </tbody>
      </table>

      <h2 id="rules">引用与校验规则</h2>
      <ul>
        <li>schema 之间用相对文件名互引,如 <code>common_types.json#/$defs/Extensions</code>、<code>catalog.json#/$defs/anyComponent</code>。</li>
        <li><code>catalog.json</code> 是占位名:校验时映射到实际目录 schema;基础目录的参考 schema(<code>basic_catalog.json</code>)随<a routerLink="/docs/spec-v1-catalog">基础目录指南</a>发布,不在 11 份之内。</li>
        <li>校验语义内嵌在 schema 中:<code>oneOf</code>、<code>additionalProperties: false</code>、放置规则等;目录 <code>$ref</code> 只允许指向自身组件/函数或 common_types.json,不得通过网络拉取。</li>
        <li>目录应同时设置 <code>$id</code> 与 <code>catalogId</code> 为同一 URI。</li>
      </ul>
      <app-code lang="json" label="信封对目录的占位引用(示意)" [code]="refJson" />
      <p>消息语义见<a routerLink="/docs/spec-v1-protocol">协议规范</a>;
      v0.9.1 的对应文件与改名映射见<a routerLink="/docs/spec-v091-schemas">v0.9.1 JSON Schema</a>。</p>
    </div>
  `,
})
export class SpecV1SchemasPage {
  protected readonly refJson = `{
  "$ref": "catalog.json#/$defs/anyComponent",
  "_comment": "校验时 catalog.json 映射到 surface 默认目录或 @catalogId 指定的目录"
}`;
}