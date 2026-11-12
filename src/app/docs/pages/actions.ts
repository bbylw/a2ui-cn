import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-actions',
  imports: [RouterLink, CodeBlock],
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-mute">概念 / 动作、事件与函数</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">动作、事件与函数</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        交互组件的 action 属性是一个二选一:event 把用户操作发回智能体、开启新一轮对话;
        functionCall 直接执行目录里的函数,不打扰智能体。函数还能出现在属性绑定、校验规则与远程调用里。
      </p>
    </header>

    <div class="doc-prose">
      <h2 id="event">事件:action.event</h2>
      <p>事件声明必填的 <code>name</code>、可选的 <code>context</code> 与 <code>userMessage</code>。
      触发时渲染器先解析绑定、求值 userMessage,再发出 action 消息。
      userMessage 是给用户看的对话文本,可以用 formatString 插值:</p>
      <app-code lang="json" label="Button 上的事件(v1.0)" [code]="eventJson" />
      <app-code lang="json" label="渲染器发出的 action 消息" [code]="actionJson" />
      <p>action 消息固定携带 <code>name</code>、<code>surfaceId</code>、<code>sourceComponentId</code>、
      ISO 8601 <code>timestamp</code> 与解析后的 <code>context</code>。
      若 surface 开启了 sendDataModel,完整数据模型另附在传输 metadata 里,见
      <a routerLink="/docs/data-binding">数据模型与绑定</a>。</p>

      <h2 id="functioncall">函数动作:action.functionCall</h2>
      <p>不需要智能体参与的操作(打开链接、本地计算、写数据模型)用 functionCall,
      不产生 action 消息、不开启智能体回合:</p>
      <app-code lang="json" label="直接调用 openUrl" [code]="openUrlJson" />

      <h2 id="rpc">远程函数调用</h2>
      <p>v1.0 起函数可以跨侧执行,两条 RPC 通道:</p>
      <ul>
        <li><strong>callAgentFunction(渲染器 → 智能体)。</strong>渲染器找不到本地实现的函数调用
          路由到智能体执行,比如查库存、查行李额度。消息带唯一 <code>functionCallId</code>,
          智能体用 <code>agentFunctionResponse</code> 回传 <code>value</code> 或 <code>error</code>。</li>
        <li><strong>callRendererFunction(智能体 → 渲染器)。</strong>智能体主动调用渲染器注册的函数,
          比如读屏幕分辨率。只能调用 <code>allowedCallers</code> 为 <code>agentOnly</code> 或
          <code>rendererOrAgent</code>、且不要求用户激活的函数;渲染器用
          <code>rendererFunctionResponse</code> 回传结果。</li>
      </ul>
      <app-code lang="json" label="callAgentFunction 出站" [code]="callAgentJson" />
      <app-code lang="json" label="callRendererFunction 入站" [code]="callRendererJson" />
      <p>v0.9.1 没有这两条通道,函数只能在渲染器本地执行。</p>

      <h2 id="binding">属性绑定里的函数:@call</h2>
      <p>动态属性除了 <code>@path</code> 还可以是函数调用,渲染器响应式求值。
      <code>@call</code> 命名函数,<code>args</code> 里可以继续嵌套绑定:</p>
      <app-code lang="json" label="Text 绑定 formatCurrency" [code]="callJson" />
      <p>v0.9.1 用普通键 <code>call</code>;v1.0 加 <code>@</code> 前缀避免与业务属性重名,
      字面量 <code>@</code> 键用双写转义(<code>@@call</code>)。</p>

      <h2 id="checks">校验:@checks</h2>
      <p>输入组件可以挂一组 CheckRule:condition 是返回布尔或 ValidationResult 的绑定/函数调用,
      message 是失败提示。severity 为 error 的规则失败会禁用关联按钮;warning、info 只提示不阻塞:</p>
      <app-code lang="json" label="TextField 上的校验规则" [code]="checksJson" />

      <h2 id="permissions">谁可以调用函数</h2>
      <table>
        <thead><tr><th>allowedCallers</th><th>含义</th></tr></thead>
        <tbody>
          <tr><td>rendererOnly(默认)</td><td>只能由渲染器本地调用。</td></tr>
          <tr><td>agentOnly</td><td>只能由智能体经 callRendererFunction 调用。</td></tr>
          <tr><td>rendererOrAgent</td><td>两侧都可以调用。</td></tr>
        </tbody>
      </table>
      <p><code>requiresUserActivation</code> 为 true 时,函数必须由真实的点击/触摸触发,
      且要求 <code>allowedCallers: "rendererOnly"</code>——防止智能体远程触发分享、支付这类敏感操作。
      函数与事件的完整字段见<a routerLink="/docs/messages">消息参考</a>与
      <a href="https://a2ui.org/concepts/actions-and-functions/" target="_blank" rel="noopener">官方 Actions 文档</a>。</p>
    </div>
  `,
})
export class ActionsPage {
  protected readonly eventJson = `{
  "id": "confirm_button",
  "component": "Button",
  "child": "confirm_label",
  "variant": "primary",
  "action": {
    "event": {
      "name": "confirmReservation",
      "userMessage": {
        "@call": "formatString",
        "args": {"value": "Confirmed flight reservation for \${/passenger/fullName}"}
      },
      "context": {
        "flightNumber": "UA-402",
        "seat": {"@path": "/selection/seatNumber"}
      }
    }
  }
}`;

  protected readonly actionJson = `{
  "version": "1.0",
  "action": {
    "name": "confirmReservation",
    "surfaceId": "booking_surface",
    "sourceComponentId": "confirm_button",
    "timestamp": "2026-11-02T03:45:00Z",
    "userMessage": "Confirmed flight reservation for Alex Rosario",
    "context": {"flightNumber": "UA-402", "seat": "14B"}
  }
}`;

  protected readonly openUrlJson = `{
  "id": "help_link",
  "component": "Button",
  "child": "help_text",
  "variant": "borderless",
  "action": {
    "functionCall": {
      "@call": "openUrl",
      "args": {"url": "https://support.example.com/billing"}
    }
  }
}`;

  protected readonly callAgentJson = `{
  "version": "1.0",
  "callAgentFunction": {
    "surfaceId": "checkout_surface",
    "functionCallId": "call_inv_check_881",
    "callFunction": {
      "@call": "checkInventory",
      "catalogId": "https://example.com/catalogs/store/v1/catalog.json",
      "args": {"sku": "SKU-99201", "quantity": 2}
    }
  }
}`;

  protected readonly callRendererJson = `{
  "version": "1.0",
  "callRendererFunction": {
    "functionCallId": "hw_screen_001",
    "callFunction": {
      "catalogId": "https://example.com/catalogs/device.json",
      "@call": "getScreenResolution",
      "args": {"screenIndex": 0}
    }
  }
}`;

  protected readonly callJson = `{
  "id": "order_total_text",
  "component": "Text",
  "text": {
    "@call": "formatCurrency",
    "args": {"value": {"@path": "/order/subtotal"}, "currency": "USD"}
  }
}`;

  protected readonly checksJson = `{
  "id": "user_email_input",
  "component": "TextField",
  "label": "Email",
  "value": {"@path": "/formData/email"},
  "@checks": [
    {
      "condition": {"@call": "required", "args": {"value": {"@path": "/formData/email"}}},
      "message": "Email address is required."
    },
    {
      "condition": {"@call": "email", "args": {"value": {"@path": "/formData/email"}}},
      "message": "Enter a valid email address."
    }
  ]
}`;
}