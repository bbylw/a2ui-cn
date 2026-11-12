import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-spec-v1-evolution',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="规范 v1.0" heading="演进指南(v0.9.1 → v1.0)">
        v1.0 相对 0.9 / 0.9.1 是破坏性升级：术语、保留键、消息与目录结构都有变化。
        本页给出差异全表与按角色的迁移清单。原文见
        <a href="https://a2ui.org/specification/v1.0-evolution-guide/" target="_blank" rel="noopener">官方 Evolution Guide</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="policy">版本政策</h2>
      <ul>
        <li>信封与协议版本引用从 <code>v0.9</code> / <code>v0.9.1</code> 更新为 <code>1.0</code>。</li>
        <li>目录新增 <code>protocolVersion</code>；省略时默认 <code>"0.9"</code> 以兼容旧目录，面向 1.0 及以后的目录<strong>必须</strong>显式声明。</li>
        <li>为 0.9 编写的目录不能直接用于 v1.0 运行时(结构性破坏变化)。</li>
        <li>1.0 之前的版本保持原样：裸 <code>accessibility</code> / <code>checks</code>、把裸 <code>metadata</code> / <code>catalogId</code> 当普通属性、拒绝 <code>@</code> 前缀信封键。</li>
        <li>弃用标记：JSON Schema <code>deprecated: true</code> 加人类可读的 <code>x-deprecated-reason</code>。</li>
      </ul>

      <h2 id="renames">术语与文件改名</h2>
      <table>
        <thead><tr><th scope="col">v0.9.1</th><th scope="col">v1.0</th></tr></thead>
        <tbody>
          <tr><td>client / server</td><td>renderer / agent</td></tr>
          <tr><td><code>server_to_client.json</code></td><td><code>agent_to_renderer.json</code></td></tr>
          <tr><td><code>client_to_server.json</code></td><td><code>renderer_to_agent.json</code></td></tr>
          <tr><td><code>client_capabilities.json</code> / <code>server_capabilities.json</code></td><td><code>renderer_capabilities.json</code> / <code>agent_capabilities.json</code></td></tr>
          <tr><td><code>client_data_model.json</code></td><td><code>renderer_data_model.json</code></td></tr>
          <tr><td><code>application/json+a2ui</code>(早期草稿)</td><td><code>application/a2ui+json</code></td></tr>
        </tbody>
      </table>
      <p><code>_list</code> 与 <code>_list_wrapper</code> 变体同步改名。</p>

      <h2 id="at">保留 @ 前缀</h2>
      <table>
        <thead><tr><th scope="col">v0.9.1</th><th scope="col">v1.0</th></tr></thead>
        <tbody>
          <tr><td><code>accessibility</code></td><td><code>@accessibility</code></td></tr>
          <tr><td><code>checks</code></td><td><code>@checks</code></td></tr>
          <tr><td><code>metadata</code>(信封 mixin)</td><td><code>@metadata</code></td></tr>
          <tr><td>—</td><td><code>@catalogId</code>(新增)</td></tr>
          <tr><td><code>&#123;"path": ...&#125;</code> / <code>&#123;"call": ...&#125;</code></td><td><code>&#123;"@path": ...&#125;</code> / <code>&#123;"@call": ...&#125;</code>；模板迭代用 <code>@index</code></td></tr>
        </tbody>
      </table>
      <p><code>id</code> 与 <code>component</code> 不加前缀。含 <code>path</code> / <code>call</code> 的普通对象现在是字面值。
      未知单 <code>@</code> 键被拒绝；字面 <code>@</code> 键双写转义(<code>@@path</code> → <code>@path</code>)。</p>
      <blockquote>
        <p>不要全局查找替换 <code>"path":</code> → <code>"@path":</code> 或 <code>"call":</code> → <code>"@call":</code>。
        排除项：ChildList 模板的 <code>path</code>、<code>updateDataModel.path</code>、普通数据(如 Icon 的 <code>call</code> 枚举值)、
        以及 <code>FunctionCall.catalogId</code>、<code>createSurface.catalogId</code>、<code>createSurface.metadata</code>、
        <code>action.metadata</code>、<code>ComponentDefinition.metadata</code>。</p>
      </blockquote>

      <h2 id="messages">消息变化</h2>
      <ul>
        <li><code>callFunction</code> → <code>callRendererFunction</code>；新增 <code>rendererFunctionResponse</code>、
        渲染器→智能体 <code>callAgentFunction</code>、智能体→渲染器 <code>agentFunctionResponse</code>。</li>
        <li><code>createSurface</code>:移除 <code>theme</code>;<code>catalogId</code> 变为可选(surface 默认);
        可内联初始 <code>components</code> 与 <code>dataModel</code>；新增可选 <code>metadata</code>(extensions)。</li>
        <li><code>action</code> 新增 <code>userMessage</code> 与 <code>metadata</code>。</li>
        <li>渲染器 <code>error</code> 支持 <code>functionCallId</code>(与 <code>surfaceId</code> 互斥);新增 <code>UNALLOWED_PARENT</code> / <code>UNALLOWED_CHILD</code>。</li>
        <li><code>updateDataModel.value</code> 变为必填；<code>null</code> 删除键；省略是 schema 错误。</li>
        <li>wire <code>FunctionCall</code> 移除 <code>allowedCallers</code> / <code>returnType</code>，改在运行时检查(违规 <code>INVALID_FUNCTION_CALL</code>)。</li>
        <li><code>surfaceId</code> 收紧为渲染器会话内全局唯一；重复 <code>createSurface</code> 报错。</li>
      </ul>

      <h2 id="catalogs">目录变化</h2>
      <ul>
        <li><code>functions</code> 变为以函数名为键的 JSON 对象 map。</li>
        <li>移除 <code>$defs/theme</code> 与 <code>primaryColor</code>；目录与 surface 创建都不再有 <code>theme</code>。</li>
        <li>新增 <code>allowedCallers</code>(rendererOnly / agentOnly / rendererOrAgent，默认 rendererOnly)、
        <code>requiresUserActivation</code>、<code>ValidationResult</code>、<code>instructions</code>(取代外部 rules.txt)、
        <code>allowedParents</code> / <code>allowedChildren</code>、保留根类型 <code>Surface</code>。</li>
        <li>允许标准 metadata(<code>$schema</code> / <code>$id</code> / <code>title</code> / <code>description</code>);名字遵循 UAX #31。</li>
        <li><code>$ref</code> 只指向自身组件/函数或 common_types.json，绝不网络拉取。</li>
        <li>新增内置 <code>@index</code>(可选 offset),仅模板循环内有效；<code>CheckRule</code> 接受动态 ValidationResult 或布尔，<code>message</code> 可选;
        <code>DynamicBoolean</code> 强制转换规则明确化；<code>regex</code> 安全方言与静态检查。</li>
        <li>无障碍新增 WAI-ARIA <code>live</code> 与 <code>hidden</code>。</li>
      </ul>

      <h2 id="basic">基础目录变化</h2>
      <ul>
        <li>新增 <code>Video.posterUrl</code>、<code>TextField.placeholder</code>、<code>Slider.steps</code>。</li>
        <li>移除 <code>TextField.validationRegexp</code>，改用 <code>@checks</code> + <code>regex</code>;<code>TextField.value</code> 必填。</li>
        <li><code>openUrl</code> 设 <code>requiresUserActivation: true</code>；校验返回类型 <code>"boolean"</code> → <code>"validationResult"</code>。</li>
        <li>组件改写为显式属性定义或 <code>$defs/Checkable</code>；标准类型引用改为相对引用。</li>
      </ul>

      <h2 id="migrate">迁移清单</h2>
      <h3 id="migrate-agent">智能体</h3>
      <ol>
        <li>信封 <code>version</code> 设 <code>"1.0"</code>；改 MIME 为 <code>application/a2ui+json</code>。</li>
        <li><code>createSurface</code> 去掉 <code>theme</code>；内联初始 components / dataModel；按需设 <code>catalogId</code>。</li>
        <li>信封 mixin 加 <code>@</code> 前缀；混用目录时用 <code>@catalogId</code> / <code>catalogId</code>。</li>
        <li>目录 <code>functions</code> 改 map；删 <code>$defs/theme</code> 与 <code>primaryColor</code>；名字过 UAX #31。</li>
        <li><code>allowedCallers</code> / <code>returnType</code> 只留在目录函数定义，不进 wire FunctionCall。</li>
        <li>采用新 Video / TextField / Slider 属性；<code>validationRegexp</code> 迁到 <code>@checks</code>；每个 TextField 设 <code>value</code>(如 <code>&#123;"@path": "/form/email"&#125;</code>)。</li>
        <li><code>updateDataModel</code> 删除用显式 <code>null</code>；处理 <code>callAgentFunction</code> 并回 <code>agentFunctionResponse</code>。</li>
      </ol>
      <h3 id="migrate-renderer">渲染器</h3>
      <ol>
        <li>实现多目录混用与解析顺序(显式 → surface 默认 → 报错);按 <code>version</code> 路由 payload 以同时支持多版本。</li>
        <li>从 <code>@</code> 键读信封 mixin；目录声明的裸属性原样透传。</li>
        <li>解析 <code>callRendererFunction</code>，检查 <code>allowedCallers</code>，违规回 <code>INVALID_FUNCTION_CALL</code>，并总是回 <code>rendererFunctionResponse</code>。</li>
        <li>发送 <code>callAgentFunction</code>、处理 <code>agentFunctionResponse</code>;error 支持 <code>functionCallId</code>。</li>
        <li>强制 surface 唯一；支持 <code>@index</code> offset 与 ValidationResult(静态 CheckRule.message 回退)。</li>
      </ol>
      <h3 id="migrate-catalog">目录作者</h3>
      <ol>
        <li>设 <code>"protocolVersion": "1.0"</code>。</li>
        <li>自定义组件可以声明 <code>metadata</code> / <code>catalogId</code> / <code>accessibility</code> / <code>checks</code>——信封 mixin 已用 <code>@</code> 让位。</li>
        <li>用相对引用(<code>common_types.json#/$defs/...</code>)替代带版本的 URL，利于向前兼容。</li>
      </ol>

      <h2 id="compat">兼容与解析规则</h2>
      <ul>
        <li>解析顺序：组件 <code>@catalogId</code> 或调用 <code>catalogId</code> → <code>createSurface</code> 的 surface 默认 → 报错；不回退到能力广告的目录。</li>
        <li>可用目录 = <code>supportedCatalogIds</code> + 协商的 <code>inlineCatalogs</code>；可混用，但必须同一 A2UI 规范版本。</li>
        <li>过渡期容忍：组件 schema 未声明某名字时，渲染器/Core SDK 仍接受 v1.0 组件上的裸 <code>catalogId</code> / <code>metadata</code> / <code>accessibility</code> / <code>checks</code>;
        同时带 <code>@</code> 与裸键的组件被拒绝。Agent SDK 只发 <code>@</code> 键。</li>
      </ul>
      <p>v0.9.1 自身的规范与它相对 v0.9 的小修订见<a routerLink="/docs/spec-v091-protocol">v0.9.1 协议规范</a>与
      <a routerLink="/docs/spec-v091-evolution">v0.9.1 演进指南</a>。</p>
    </div>
  `,
})
export class SpecV1EvolutionPage {}