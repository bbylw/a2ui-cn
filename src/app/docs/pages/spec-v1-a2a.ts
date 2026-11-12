import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-spec-v1-a2a',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="规范 v1.0 / A2A 扩展" heading="A2A 扩展(v1.0)">
        A2A 是 A2UI 的官方传输绑定之一:智能体把界面作为 DataPart 流式发给渲染器。
        扩展 URI 编码协议版本,是双方沟通版本支持的规范方式。原文见
        <a href="https://a2ui.org/specification/v1.0-a2ui-extension-specification/" target="_blank" rel="noopener">官方 A2A Extension</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="uri">扩展 URI 与激活</h2>
      <app-code lang="text" label="规范扩展 URI" [code]="extensionUri" />
      <ul>
        <li><strong>JSON-RPC / HTTP:</strong>请求头 <code>X-A2A-Extensions</code> 携带该 URI。</li>
        <li><strong>gRPC:</strong>URI 放入 <code>sendMessageParams.metadata["X-A2A-Extensions"]</code>。</li>
        <li>激活是可选的:也可以靠消息元数据协商——渲染器带 <code>a2uiRendererCapabilities</code>,
        智能体回以 A2UI mimeType 的 DataPart,渲染器即知其中是 A2UI 消息。</li>
        <li><strong>不要</strong>用 <code>accepted_output_modes: ['a2ui']</code> 触发 A2UI,那不是 A2UI 标准。</li>
      </ul>

      <h2 id="datapart">DataPart 映射</h2>
      <p>A2UI 消息装在 A2A <code>DataPart</code> 里,以 <code>DataPart.metadata["mimeType"] = "application/a2ui+json"</code> 标识;
      <code>data</code> 字段<strong>必须是消息数组</strong>:智能体方向对照 Agent-to-Renderer Message List Schema 校验,
      渲染器方向对照 Renderer-to-Agent Message List Schema 校验。</p>
      <app-code lang="json" label="智能体 → 渲染器 DataPart" [code]="dataPartJson" />

      <h2 id="agentcard">Agent Card 声明</h2>
      <p>建议在 <code>AgentCapabilities.extensions</code> 中广告(可选但鼓励):
      <code>uri</code> 为扩展 URI,<code>required: false</code>,<code>params</code> 对照
      <code>agent_capabilities.json#/properties/1.0</code> 校验——只带内层 <code>1.0</code> 对象,不带外层包装:</p>
      <app-code lang="json" label="Agent Card extensions 条目" [code]="agentCardJson" />
      <ul>
        <li><code>params.supportedCatalogIds</code>(可选):智能体可生成的目录 id 字符串数组,不必是可解析 URI。</li>
        <li><code>params.acceptsInlineCatalogs</code>(可选布尔,默认 false):是否接受渲染器的 <code>inlineCatalogs</code>。</li>
      </ul>

      <h2 id="metadata">消息元数据</h2>
      <table>
        <thead><tr><th scope="col">键</th><th scope="col">内容</th></tr></thead>
        <tbody>
          <tr><td><code>message.metadata["a2uiRendererCapabilities"]</code></td><td>整份按版本键控的能力对象,对照 Renderer Capabilities Schema 校验,如 <code>&#123;"1.0": &#123;"supportedCatalogIds": [...]&#125;&#125;</code>。</td></tr>
          <tr><td><code>message.metadata["a2uiRendererDataModel"]</code></td><td>开启数据模型同步后每条消息附带,对照 Renderer Data Model Schema(<code>version</code> + <code>surfaces</code>)。</td></tr>
        </tbody>
      </table>
      <p><strong>按回合 scoped(规范 MUST):</strong>能力是 per-turn 的。某条消息若没有本版本的
      <code>a2uiRendererCapabilities</code> 条目,智能体必须把该回合视为渲染器不提供 A2UI,
      且不得回以 <code>application/a2ui+json</code> DataPart;其他版本的条目忽略。
      仅靠 <code>X-A2A-Extensions</code> 激活并不等于提供了目录。</p>

      <h2 id="processing">处理规则</h2>
      <ul>
        <li>消息列表<strong>不是事务</strong>:接收方必须按顺序逐条处理。</li>
        <li>单条失败时应当记录/上报错误,并必须继续处理剩余消息;原子性只到单条消息级别。</li>
        <li>渲染器应避免在整列表处理完前重绘,防止闪烁。</li>
      </ul>
      <p>A2A 之外的传输绑定(AG-UI、MCP、自有 SSE/WebSocket)见<a routerLink="/docs/spec-v1-protocol">协议规范</a>的传输契约;
      v0.9.1 的 URI 与元数据键名差异见<a routerLink="/docs/spec-v091-a2a">v0.9.1 A2A 扩展</a>。</p>
    </div>
  `,
})
export class SpecV1A2aPage {
  protected readonly extensionUri = 'https://a2ui.org/a2a-extension/a2ui/v1.0';
  protected readonly dataPartJson = `{
  "kind": "data",
  "metadata": {"mimeType": "application/a2ui+json"},
  "data": [
    {"version": "1.0", "createSurface": {"surfaceId": "trip", "catalogId": "https://example.com/catalogs/travel/v1"}},
    {"version": "1.0", "updateComponents": {"surfaceId": "trip", "components": [{"id": "root", "component": "Text", "text": "Hello"}]}}
  ]
}`;
  protected readonly agentCardJson = `{
  "capabilities": {
    "extensions": [
      {
        "uri": "https://a2ui.org/a2a-extension/a2ui/v1.0",
        "description": "A2UI v1.0 generative UI",
        "required": false,
        "params": {
          "supportedCatalogIds": ["https://example.com/catalogs/travel/v1"],
          "acceptsInlineCatalogs": true
        }
      }
    ]
  }
}`;
}