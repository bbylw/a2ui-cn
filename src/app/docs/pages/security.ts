import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-security',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="概念" heading="安全模型">
        生成式 UI 把模型输出直接变成用户看到的界面，提示注入因此可能变成界面注入。
        A2UI 的回答是：模型永远不写代码，只写白名单内的声明式描述。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="threat">威胁模型</h2>
      <p>智能体的输入（用户消息、检索内容、工具结果）都可能携带恶意指令。如果界面由模型自由生成 HTML 或脚本，
      一次提示注入就能变成 XSS、钓鱼表单或静默导航。A2UI 把攻击面压缩为：<strong>一份结构受限的 JSON 描述</strong>。
      渲染器面对的不是「模型想执行的代码」，而是「模型想引用的组件」。</p>

      <h2 id="catalog">目录即白名单</h2>
      <ul>
        <li><strong>只渲染注册过的组件。</strong>目录之外的组件名一律拒绝，模型无法凭空引入 <code>&lt;script&gt;</code>、iframe 或任意 HTML。</li>
        <li><strong>schema 校验。</strong>每个组件的属性按 JSON Schema（渲染侧常用 zod）校验，类型不对、必填缺失都会被拦下。</li>
        <li><strong>放置约束。</strong><code>allowedParents</code> 声明组件能出现在哪些父组件下，违规的树结构在编译期（服务端）与渲染期都会被拒绝。</li>
        <li><strong>双向一致。</strong>智能体侧与渲染侧读同一份目录定义，服务端校验过的消息，客户端按同样的规则解析。</li>
      </ul>

      <h2 id="no-code">没有任意代码执行</h2>
      <p>消息里没有可执行代码：没有 eval、没有脚本字符串、没有内联事件处理器。
      数据绑定表达式是受限的求值语言（JSON Pointer、字符串插值、注册函数调用），不是 JavaScript。
      函数只能调用目录里预先注册的实现，模型只能「点名」，不能「定义」。</p>

      <h3 id="boundaries">函数执行边界</h3>
      <p>v1.0 为每个函数声明两道运行时闸门，渲染器必须强制执行：</p>
      <table>
        <thead><tr><th scope="col">声明</th><th scope="col">取值</th><th scope="col">含义</th></tr></thead>
        <tbody>
          <tr><td><code>allowedCallers</code></td><td><code>rendererOnly</code>（默认）/ <code>agentOnly</code> / <code>rendererOrAgent</code></td><td>谁可以调用这个函数。智能体用 callRendererFunction 调用 rendererOnly 函数会被立即拒绝。</td></tr>
          <tr><td><code>requiresUserActivation</code></td><td>boolean</td><td>为 true 的函数（如 openUrl）只能在真实用户手势中执行；放在被动属性绑定或校验条件里会被渲染器阻止。</td></tr>
        </tbody>
      </table>
      <p>违规调用返回结构化错误（<code>INVALID_FUNCTION_CALL</code>、<code>EXPRESSION_ERROR</code>），
      而不是静默失败或降级执行。这意味着「模型让界面在用户没点击时悄悄打开一个 URL」这类攻击在协议层就被封死。</p>

      <h2 id="data">数据与呈现分离</h2>
      <ul>
        <li>组件树与数据模型分开传输，绑定在客户端本地解析；模型不能借绑定表达式执行逻辑。</li>
        <li>数据模型同步是显式选择开启：只有 surface 声明 <code>sendDataModel: true</code>，渲染器才会在消息元数据里附带完整数据模型。</li>
        <li>输入组件的双向绑定只写本地数据模型，回传智能体的内容由 action 的 context 显式声明，边界清晰可审计。</li>
      </ul>

      <h2 id="transport">传输与信任</h2>
      <p>A2UI 本身不定义认证与加密，这些由传输层负责：生产环境请使用 TLS，并在传输层验证智能体身份。
      每个 MessageProcessor 通常对应一段会话，surface 之间相互隔离；不同会话使用不同的处理器实例，
      避免跨会话的 surfaceId 冲突与数据泄漏。</p>

      <h2 id="renderer">渲染器责任</h2>
      <ul>
        <li>文本按纯文本渲染，Markdown 走消毒后的渲染管线（<code>@a2ui/markdown-it</code>），不注入原始 HTML。</li>
        <li>Image/Video 等媒体 URL 与 openUrl 目标应限制 scheme（http/https），拒绝 javascript：等危险协议。</li>
        <li>把协议的无障碍属性映射到宿主平台 API，别让安全护栏变成可用性护栏。</li>
        <li>对无法解析的消息返回结构化错误并记录，而不是渲染半成品。</li>
      </ul>

      <h2 id="checklist">实践清单</h2>
      <ol>
        <li>目录最小化：只注册业务真正需要的组件与函数。</li>
        <li>敏感函数声明 <code>requiresUserActivation: true</code>，远程可调函数显式声明 <code>allowedCallers</code>。</li>
        <li>服务端开启有状态校验，让坏消息在到达客户端前反馈给模型自纠。</li>
        <li>传输层做认证与 TLS；按会话隔离 MessageProcessor。</li>
        <li>记录 action 与错误消息，作为审计与监控信号（见<a routerLink="/docs/roadmap">路线图</a>的监控阶段）。</li>
        <li>发现协议或 SDK 漏洞，走 <a href="https://g.co/vulnz" target="_blank" rel="noopener">Google 漏洞报告渠道</a>，不要开公开 issue。</li>
      </ol>
    </div>
  `,
})
export class SecurityPage {}