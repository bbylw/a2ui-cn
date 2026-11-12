import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-intro',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="入门" heading="A2UI 简介">
        A2UI(Agent-to-UI)是一个开放协议,让 AI 智能体用声明式 JSON 描述界面,
        由客户端用自己的原生组件渲染。智能体回答的不再只是一段文字,而是一张可以点的卡片、
        一个可以拖的日期、一块随对话实时更新的面板。
    </app-docs-page-header>

    <div class="doc-prose">
      <blockquote>
        <p><strong>v1.0 已稳定。</strong>2026 年 11 月 11 日,Google 在开发者博客宣布 A2UI 1.0,
        协议、SDK 与一致性测试套件同步发布。项目以 Apache-2.0 许可开源。</p>
      </blockquote>

      <h2 id="why">为什么需要 A2UI</h2>
      <p>让智能体输出界面,过去通常只有三条路,每条都有明显的代价:</p>
      <ul>
        <li><strong>纯文本或 Markdown。</strong>安全但表达力有限:没有表单、没有交互状态,复杂流程只能靠用户来回打字。</li>
        <li><strong>生成 HTML 或截图。</strong>灵活但危险:模型输出直接进入 DOM,提示注入可以变成脚本注入;样式也难以融入宿主应用。</li>
        <li><strong>嵌入 iframe 或 WebView。</strong>隔离了风险,却带来沉重的加载、割裂的视觉与受限的原生能力,移动端尤其明显。</li>
      </ul>
      <p>A2UI 的答案是把「描述界面」和「渲染界面」拆开:智能体只发送<strong>结构化的组件描述与数据</strong>,
      客户端从自己注册的组件目录里挑选实现来渲染。模型永远不接触你的代码、DOM 或运行时。</p>

      <h2 id="how">工作方式</h2>
      <ol>
        <li><strong>定义目录(Catalog)。</strong>你声明智能体可以使用的组件与函数,例如基础目录里的 Text、Card、Button、Slider。</li>
        <li><strong>智能体流式发送消息。</strong>createSurface 开辟一块界面,updateComponents 增量搭建组件树,updateDataModel 刷新数据。</li>
        <li><strong>渲染器绘制。</strong>MessageProcessor 应用消息、解析数据绑定,React、Angular、Flutter、SwiftUI、Compose 各自用平台组件渲染。</li>
        <li><strong>交互回流。</strong>用户点击按钮或修改输入,渲染器把 action 消息发回智能体,驱动下一轮对话与界面更新。</li>
      </ol>
      <p>想动手看这条链路,直接打开本站的 <a routerLink="/playground">Playground</a>:
      它逐条播放真实协议消息,并同时驱动 Angular 与 React 两个渲染器。</p>

      <h2 id="principles">设计原则</h2>
      <ul>
        <li><strong>安全优先。</strong>目录即白名单:未注册的组件不渲染,消息里没有可执行代码,函数只能调用预先注册的实现。详见<a routerLink="/docs/security">安全模型</a>。</li>
        <li><strong>模型友好。</strong>扁平的组件邻接表适合流式生成;Express 推理格式进一步压缩 token;SDK 在服务端做有状态校验,错误在到达客户端前就反馈给模型自纠。</li>
        <li><strong>原生渲染。</strong>同一份消息,在 Web 上是 React/Angular/Lit 组件,在移动端是 Flutter widget、SwiftUI 视图或 Compose 组件,继承宿主应用的主题与无障碍能力。</li>
        <li><strong>传输无关。</strong>消息只是 JSON,可以走 A2A、AG-UI、MCP、WebSocket、SSE 或普通 REST,协议不绑定任何传输或模型。</li>
      </ul>

      <h2 id="not">A2UI 不是什么</h2>
      <ul>
        <li>不是又一个 UI 框架:它不取代 React、Angular 或 Flutter,而是让这些框架渲染智能体生成的界面。</li>
        <li>不是 HTML 的替代品:它不追求表达任意网页,只覆盖对话式应用需要的组件与交互。</li>
        <li>不绑定模型或厂商:任何能输出 JSON 的模型都可以驱动 A2UI,官方 SDK 只是让这件事更可靠。</li>
      </ul>

      <h2 id="adopters">谁在使用</h2>
      <p>A2UI 由 Google 发起,与社区共同维护。Gemini 的生成式界面、Atlassian、Alation、ByteDance 等团队已在产品中使用或集成,
      AG-UI 与 CopilotKit 生态把它作为智能体到前端的界面通道。产品案例见<a routerLink="/docs/built-with">Built with A2UI</a>,完整名单与社区渲染器见<a routerLink="/docs/ecosystem">社区项目</a>。</p>

      <h2 id="next">下一步</h2>
      <div class="not-prose mt-6 grid gap-3 sm:grid-cols-3">
        <a routerLink="/docs/quickstart" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">快速开始</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">三条命令跑起官方 Travel A2UI 示例,或直接用在线工具。</span>
        </a>
        <a routerLink="/docs/concepts" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">核心概念</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">Surface、组件树、目录、数据绑定与动作的完整心智模型。</span>
        </a>
        <a routerLink="/playground" class="group rounded-xl border border-ink-900 bg-ink-900 p-5 shadow-panel transition-all hover:-translate-y-0.5">
          <span class="font-display text-[15px] font-bold text-white">Playground</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-white/60">在本站直接播放、编辑协议消息,观察双渲染器实时响应。</span>
        </a>
      </div>
    </div>
  `,
})
export class IntroPage {}