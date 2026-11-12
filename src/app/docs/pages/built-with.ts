import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-built-with',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="生态" heading="Built with A2UI">
        A2UI 不只是示例协议:Google 与业界团队已经把它放进真实产品。
        下面五个案例展示同一份协议消息如何在数据平台、跨端框架、项目管理与 AI 助手里落地。
        案例中提及的协议版本均为各产品公开资料发布时的状态,与本站当前的 v1.0 文档无关。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="alation">Alation AIOS · Alation</h2>
      <p>Alation 的 Intelligence Operating System 用 A2UI 构建 AI 生成的数据 feed:指标卡、图表,
      每张图表还能展开背后的 SQL 查询与数据。同一份 feed 既渲染在 Alation 产品内,
      也渲染在 Claude 等外部 AI 助手里——界面跟着数据走,而不是跟着宿主走。</p>
      <ul>
        <li><a href="https://www.alation.com" target="_blank" rel="noopener">alation.com</a></li>
      </ul>
      <blockquote>
        <p>AIOS 把数据、图表与洞察带到团队工作的地方。A2UI 提供了「交互式 UI 脚手架」,
        让每个产物都像是为当下场景量身定制。—— GT Volpe,Alation 产品管理副总裁</p>
      </blockquote>

      <h2 id="lynx">Lynx · ByteDance</h2>
      <p>ByteDance 于 2026 年 6 月发布了面向 Lynx 的 A2UI 渲染器。Lynx 是覆盖移动、Web 与桌面的跨平台框架,
      其渲染器让流式界面保持顺滑,并自带 lynx-ui 组件库作为默认实现。
      Lynx GenUI Playground 演示了 A2UI 消息的原生渲染(例如京都行程规划器);
      当前支持 A2UI 0.9,正在推进 1.0 与 A2UI Express。</p>
      <ul>
        <li><a href="https://lynx-stack.dev/genui/#/a2ui" target="_blank" rel="noopener">GenUI Playground</a></li>
        <li><a href="https://lynxjs.org/next/react/genui/a2ui.html" target="_blank" rel="noopener">渲染器文档</a></li>
        <li><a href="https://github.com/lynx-family/lynx-stack/tree/main/packages/genui/a2ui" target="_blank" rel="noopener">源码</a></li>
      </ul>
      <blockquote>
        <p>A2UI 把「模型生产界面」与「应用渲染界面」分开:推理格式与宏都可以替换。
        在我们的 playground 里,决策模型只挑选组件而不写文本,SDK 把这些决策变成 Lynx 原生渲染的屏幕。
        —— Shouqun Liu,ByteDance Lynx 工程负责人</p>
      </blockquote>

      <h2 id="jira">Jira · Atlassian</h2>
      <p>Atlassian 正在把 A2UI 带进 Jira,让团队把工作项指派给 AI 智能体。
      当智能体需要澄清或决策时,它在工作项里嵌入一张交互卡片提问,团队直接在 Jira 内作答,
      不必离开上下文去聊天窗口。</p>
      <ul>
        <li><a href="https://www.atlassian.com/software/jira/dev" target="_blank" rel="noopener">Jira for developers</a></li>
      </ul>

      <h2 id="notebook">Gemini Notebook · Google</h2>
      <p>Gemini Notebook 用 A2UI 卡片在生成幻灯片之前确认意图:一张选项卡询问要演讲型幻灯片还是详细文档、
      聚焦哪些主题;一张复核卡展示格式、重点与视觉风格供修改,然后才开始生成。
      类似的卡片也引导 Web 与移动端的 Video Overviews。</p>

      <h2 id="enterprise">Gemini Enterprise · Google Cloud</h2>
      <p>Gemini Enterprise 支持组织注册自己的智能体,并以 A2UI 回应:响应使用其 A2UI 组件画廊中的组件渲染,
      当前支持 A2UI 0.9.1。Google Cloud 文档覆盖智能体注册、组件画廊参考与在 Cloud Run 上托管智能体的完整教程。</p>
      <ul>
        <li><a href="https://cloud.google.com/blog/topics/developers-practitioners/guide-to-gemini-enterprise-and-a2ui-integration" target="_blank" rel="noopener">Gemini Enterprise 与 A2UI 集成指南</a></li>
        <li><a href="https://docs.cloud.google.com/gemini/enterprise/docs/a2ui-agents/register-and-manage-an-a2ui-agent" target="_blank" rel="noopener">注册与管理 A2UI 智能体</a></li>
        <li><a href="https://docs.cloud.google.com/gemini/enterprise/docs/a2ui-agents/a2ui-component-gallery-reference" target="_blank" rel="noopener">组件画廊参考</a></li>
        <li><a href="https://docs.cloud.google.com/gemini/enterprise/docs/a2ui-agents/tutorial-host-agent-cloud-run" target="_blank" rel="noopener">在 Cloud Run 托管智能体</a></li>
      </ul>

      <h2 id="build">用 A2UI 构建你自己的产品</h2>
      <p>这些产品共享同一条链路:目录定义护栏,智能体组合界面,渲染器原生绘制。你可以从示例开始:</p>
      <ul>
        <li><a routerLink="/docs/quickstart">快速开始</a>:三条命令跑起 Web + 移动端示例。</li>
        <li><a routerLink="/playground">本站 Playground</a>:零安装逐条播放协议消息。</li>
        <li>给你的编码智能体装上协议规则与集成指南:</li>
      </ul>
      <app-code lang="bash" label="安装 A2UI agent skills" [code]="skillsCmd" />
      <p>案例与渲染器的完整名单见<a routerLink="/docs/ecosystem">社区项目</a>。</p>
    </div>
  `,
})
export class BuiltWithPage {
  protected readonly skillsCmd = 'bunx skills add a2ui-project/a2ui';
}