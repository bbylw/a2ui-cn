import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-spec-v091-a2a',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="规范 v0.9.1 / A2A 扩展" heading="A2A 扩展规范(v0.9.1)">
        把 A2UI v0.9.1 接入 A2A 智能体协议:扩展 URI、Agent Card 声明、DataPart 编码与客户端元数据。
        原文见<a href="https://a2ui.org/specification/v0.9.1-a2ui-extension-specification/" target="_blank" rel="noopener">官方 v0.9.1 A2A Extension Specification</a>。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="uri">扩展 URI 与激活</h2>
      <app-code lang="text" label="规范扩展 URI" [code]="extensionUri" />
      <ul>
        <li>URI 显式编码版本:客户端请求该 URI 即表示支持 v0.9.1 的 schema 格式。</li>
        <li><strong>JSON-RPC / HTTP:</strong>在 <code>X-A2A-Extensions</code> 请求头携带扩展 URI。</li>
        <li><strong>gRPC:</strong>把 URI 放进 <code>sendMessageParams.metadata["X-A2A-Extensions"]</code>。</li>
        <li>激活是可选的:也可以通过消息元数据 <code>a2uiClientCapabilities</code> 与 DataPart 的
        <code>mimeType: "application/a2ui+json"</code> 完成协商——客户端附能力声明,智能体据此了解支持的协议版本与目录;
        智能体返回带该 mimeType 的 DataPart,客户端即知其中是 A2UI 消息。</li>
      </ul>
      <blockquote>
        <p>不要用 <code>accepted_output_modes: ['a2ui']</code> 触发 A2UI——那不是 A2UI 标准。</p>
      </blockquote>

      <h2 id="agentcard">Agent Card 声明</h2>
      <p>鼓励(不强制)智能体在 <code>capabilities.extensions</code> 里广告 A2UI 支持;
      扩展的 <code>params</code> 对象对应 <code>server_capabilities.json</code>:</p>
      <ul>
        <li><code>uri</code>:扩展 URI;<code>description</code>:能力描述;<code>required</code>:是否必需(示例为 false)。</li>
        <li><code>params.supportedCatalogIds</code>(可选):目录 ID 字符串数组,<strong>不一定是可解析的 URI</strong>。</li>
        <li><code>params.acceptsInlineCatalogs</code>(可选):是否接受客户端内联目录,省略默认 false。</li>
      </ul>
      <app-code lang="json" label="Agent Card 扩展声明(节选)" [code]="agentCardJson" />

      <h2 id="datapart">DataPart 编码</h2>
      <p>A2UI 消息装在 A2A <code>DataPart</code> 里,<code>metadata["mimeType"]</code> 为
      <code>application/a2ui+json</code>,<code>data</code> 字段<strong>必须是消息数组</strong>:</p>
      <ul>
        <li>服务器 → 客户端:按 <code>server_to_client_list.json</code> 校验,每条消息带 <code>version</code> 加一个消息键。</li>
        <li>客户端 → 服务器:同一 MIME 类型,按 <code>client_to_server_list.json</code> 校验(action / error)。</li>
      </ul>
      <app-code lang="json" label="服务器 → 客户端 DataPart" [code]="dataPartJson" />

      <h2 id="metadata">客户端元数据</h2>
      <table>
        <thead><tr><th scope="col">字段</th><th scope="col">schema</th><th scope="col">语义</th></tr></thead>
        <tbody>
          <tr><td><code>a2uiClientCapabilities</code></td><td><code>client_capabilities.json</code></td><td>附在客户端的<strong>每条</strong> A2A 消息上,按协议版本为键(示例用 <code>"v0.9.1"</code>),声明支持的目录;服务器接受内联目录时可附 inlineCatalogs。</td></tr>
          <tr><td><code>a2uiClientDataModel</code></td><td><code>client_data_model.json</code></td><td>surface 开启数据模型同步(createSurface 的 <code>sendDataModel: true</code>)后,附在<strong>每条</strong>消息上:<code>version</code> + <code>surfaces</code>(surfaceId → 数据对象),让智能体拿到最新 UI 状态。</td></tr>
        </tbody>
      </table>
      <app-code lang="json" label="客户端消息元数据(节选)" [code]="clientMetaJson" />

      <h2 id="processing">处理规则</h2>
      <ul>
        <li>消息列表<strong>不是事务单元</strong>:接收方(客户端与智能体)必须按顺序逐条处理。</li>
        <li>某条校验或应用失败时,记录/上报该错误,并<strong>继续处理其余消息</strong>;原子性只保证到单条消息。</li>
        <li>为了更好的体验,渲染器应等列表全部处理完再重绘,避免中间状态闪烁。</li>
      </ul>

      <h2 id="diff">与 v1.0 扩展的差异</h2>
      <p>v1.0 把扩展 URI 升级为 <code>…/a2ui/v1.0</code>,元数据改名为
      <code>a2uiRendererCapabilities</code> / <code>a2uiRendererDataModel</code>(以 <code>"1.0"</code> 为键),
      并新增每轮 MUST 作用域规则;详见<a routerLink="/docs/spec-v1-a2a">v1.0 A2A 扩展</a>。
      本页引用的 schema 文件见<a routerLink="/docs/spec-v091-schemas">v0.9.1 JSON Schema</a>。</p>
    </div>
  `,
})
export class SpecV091A2aPage {
  protected readonly extensionUri = 'https://a2ui.org/a2a-extension/a2ui/v0.9.1';
  protected readonly agentCardJson = `{
  "capabilities": {
    "extensions": [{
      "uri": "https://a2ui.org/a2a-extension/a2ui/v0.9.1",
      "description": "Ability to render A2UI v0.9.1",
      "required": false,
      "params": {
        "supportedCatalogIds": [
          "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"
        ],
        "acceptsInlineCatalogs": true
      }
    }]
  }
}`;
  protected readonly dataPartJson = `{
  "kind": "data",
  "metadata": {"mimeType": "application/a2ui+json"},
  "data": [
    {
      "version": "v0.9.1",
      "createSurface": {
        "surfaceId": "dashboard",
        "catalogId": "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"
      }
    },
    {
      "version": "v0.9.1",
      "updateComponents": {
        "surfaceId": "dashboard",
        "components": [{"id": "root", "component": "Text", "text": "你好!"}]
      }
    }
  ]
}`;
  protected readonly clientMetaJson = `{
  "metadata": {
    "a2uiClientCapabilities": {
      "v0.9.1": {
        "supportedCatalogIds": [
          "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"
        ]
      }
    },
    "a2uiClientDataModel": {
      "version": "v0.9.1",
      "surfaces": {
        "dashboard": {"email": "user@example.com"}
      }
    }
  }
}`;
}