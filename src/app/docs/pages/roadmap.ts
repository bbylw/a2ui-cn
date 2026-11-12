import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-docs-roadmap',
  imports: [DocsPageHeader, RouterLink],
  template: `
    <app-docs-page-header eyebrow="生态 / 路线图" heading="路线图">
        协议之外的工具链路线:把一个生成式 UI 智能体从第一个组件带到生产环境。
        五个阶段构成循环,监控学到的东西回到组件工作;A2UI CLI 的目标是覆盖全部阶段。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="loop">五阶段循环</h2>
      <p>构建组件 → 配置智能体 → 评估质量 → 分发到平台 → 监控演进,再回到构建。
      下面按阶段列出「今天可用」与「规划中」。计划会随社区反馈调整,以仓库为准。</p>

      <h2 id="build">1 · 构建跨平台组件</h2>
      <p>目标:设计一次,处处原生渲染。</p>
      <p><strong>今天可用:</strong></p>
      <ul>
        <li><strong>目录。</strong>一份 JSON Schema 同时被智能体与渲染器读取;指南覆盖提示词指令、可复用定义的主题化与 CI 中的 schema parity 测试。</li>
        <li><strong>基础目录。</strong>随每个官方渲染器附带,样式继承宿主框架主题。</li>
        <li><strong>官方渲染器。</strong>React、Lit、Angular、Flutter、SwiftUI、Jetpack Compose。</li>
        <li><strong>Universal Web Components。</strong>写一次,注册进 Lit、React 与 Angular。</li>
        <li><code>a2ui codegen</code> 从目录生成类型安全的组件构建器;A2UI Composer 提供可视化布局编辑。</li>
      </ul>
      <p><strong>规划中:</strong></p>
      <ul>
        <li>按你的设计系统样式化、可声明式描述的原语,去掉逐平台实现。</li>
        <li>运行时模板引擎:把描述在各平台原生渲染。</li>
        <li>安全沙箱:需要共享业务逻辑(校验、计价)的组件写一次,在每个客户端安全运行。</li>
      </ul>

      <h2 id="configure">2 · 配置智能体</h2>
      <p>目标:智能体知道何时、如何使用每个组件。</p>
      <p><strong>今天可用:</strong></p>
      <ul>
        <li>Python 与 TypeScript Agent SDK 的 <code>SkillGenerator</code>:从目录生成带语法规则与组件/函数签名的技能,组件一变技能跟着变。</li>
        <li>目录协商:按客户端选出目录与协议版本。</li>
        <li>推理格式(默认 Express、另有 Direct JSON):模型输出编译成标准消息,客户端无需改动。</li>
        <li>有状态校验:对照活 surface 状态校验输出,错误在到达客户端前返回给模型。</li>
        <li>Google ADK 与 A2A 集成;其他服务器见<a routerLink="/docs/agent-sdk">Agent 集成</a>。</li>
      </ul>
      <p><strong>规划中:</strong></p>
      <ul>
        <li>决策模型(如 TypeSafe 的 Jev)作为官方推理格式:类型化的布局决策取代逐 token 生成,布局决策最快可提升 80 倍。参考 <a href="https://github.com/apparite/jev2ui" target="_blank" rel="noopener">jev2ui</a> 与 Google Developers Blog 的基准文章。</li>
        <li>技能生成器更清晰的错误处理与诊断。</li>
        <li>Dart Agent SDK 的技能生成(尚不支持)。</li>
        <li>更多智能体框架集成。</li>
      </ul>

      <h2 id="evaluate">3 · 评估生成质量</h2>
      <p>目标:知道智能体是否选对了组件、是否搭对了界面。</p>
      <p><strong>今天可用:</strong></p>
      <ul>
        <li>基于 Inspect AI 的评估框架:三阶段打分——schema/结构校验、确定性断言、LLM 评审意图与质量。</li>
        <li>推理格式之间的 token 与延迟基准。</li>
      </ul>
      <p><strong>规划中:</strong>面向自有智能体与目录的评估指南与工具,组合三种裁判:
      对照目录与场景要求的确定性规则、评判 UI 是否契合用户意图的 LLM 评审、检查工具调用与上下文的工具使用评审。</p>

      <h2 id="distribute">4 · 分发到各平台</h2>
      <p>目标:一个智能体触达用户所在的任何地方。</p>
      <p><strong>今天可用:</strong></p>
      <ul>
        <li>Web/桌面渲染器(React、Lit、Angular)与移动渲染器(Flutter、SwiftUI、Jetpack Compose)。</li>
        <li>MCP 双向互嵌:在 MCP App 内渲染 A2UI,或在 A2UI surface 里嵌入 MCP Apps(<code>McpApp</code> 已能与兄弟组件共享数据路径)。四种模式的取舍见<a routerLink="/docs/mcp">MCP 总览</a>。</li>
        <li><a routerLink="/docs/ecosystem">社区项目</a>覆盖更多框架与平台。</li>
      </ul>
      <p><strong>规划中:</strong></p>
      <ul>
        <li>MCP Apps 工具链优先:先是 A2UI 运行在 MCP App 内时与 MCP host/server 的共享状态。</li>
        <li>面向 AI 助手(Gemini、Claude、ChatGPT)与消息应用(Microsoft Teams、Slack)的指南与示例。</li>
      </ul>

      <h2 id="monitor">5 · 监控与演进</h2>
      <p>目标:让生成式 UI 从用户行为中学习。</p>
      <p><strong>今天可用:</strong>渲染器到智能体的消息已经上报用户动作与函数结果,提供可记录的事件源。</p>
      <p><strong>规划中:</strong>该收集哪些日志的指南(渲染出的 surface、action、错误、被放弃的流程),
      以及把信号转化为设计与组件更新、回到构建阶段的方法。</p>

      <h2 id="cli">A2UI CLI</h2>
      <p>今天 <code>a2ui codegen</code> 生成类型安全的组件构建器。规划中的扩展覆盖整个循环:</p>
      <table>
        <thead><tr><th scope="col">阶段</th><th scope="col">CLI 将提供</th></tr></thead>
        <tbody>
          <tr><td>构建</td><td>脚手架、生成、预览、发布组件与目录</td></tr>
          <tr><td>配置</td><td>生成技能;把目录接到智能体</td></tr>
          <tr><td>评估</td><td>校验输出;运行评估套件</td></tr>
          <tr><td>分发</td><td>为原生应用、助手、MCP Apps host 打包智能体</td></tr>
          <tr><td>监控</td><td>把使用与反馈数据拉回你的项目</td></tr>
        </tbody>
      </table>
      <p>CLI 在终端运行、可脚本化,编码智能体可以直接驱动它;仓库还附带一个 A2UI agent skill,
      教编码智能体完成构建、接线、评估、发布与读反馈的整条链路。</p>

      <h2 id="versions">协议版本状态</h2>
      <p><code>specification/versions.json</code> 是版本状态的唯一事实来源:</p>
      <table>
        <thead><tr><th scope="col">版本</th><th scope="col">状态</th></tr></thead>
        <tbody>
          <tr><td>v1.0</td><td>当前(Current)</td></tr>
          <tr><td>v0.9.1</td><td>上一代(Previous)</td></tr>
          <tr><td>v0.9</td><td>上一代(Previous)</td></tr>
          <tr><td>v0.8</td><td>已弃用(Deprecated)</td></tr>
        </tbody>
      </table>
      <p>各版本的规范与迁移差异见<a routerLink="/docs/spec-v1-evolution">v1.0 演进指南</a>与
      <a routerLink="/docs/spec-v091-evolution">v0.9.1 演进指南</a>。</p>

      <h2 id="involved">参与</h2>
      <ul>
        <li>讨论与提问:<a href="https://github.com/a2ui-project/a2ui/discussions" target="_blank" rel="noopener">GitHub Discussions</a>。</li>
        <li>Bug 与功能请求:<a href="https://github.com/a2ui-project/a2ui/issues" target="_blank" rel="noopener">GitHub Issues</a>。</li>
        <li>想先动手感受协议本身,回到<a routerLink="/playground">Playground</a>。</li>
      </ul>
    </div>
  `,
})
export class RoadmapPage {}