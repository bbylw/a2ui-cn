import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-quickstart',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="入门" heading="快速开始">
        两条路径：不装任何东西，用在线工具立刻体验；或者三条命令，在本地跑起官方的
        Travel A2UI 示例：一个 Python 智能体服务器，同时服务 React Web 端与 Flutter 移动端。
    </app-docs-page-header>

    <div class="doc-prose">
      <h2 id="no-install">零安装体验</h2>
      <ul>
        <li><strong>本站 Playground。</strong><a routerLink="/playground">打开 Playground</a>，逐条播放航班预订、餐厅订位、实时仪表盘三个场景的协议消息，还能编辑 JSON 自己发消息。</li>
        <li><strong>A2UI Composer。</strong><a href="https://a2ui-editor.ag-ui.com" target="_blank" rel="noopener">a2ui-editor.ag-ui.com</a> 是官方可视化工作台：向助手提需求、查看流式消息与 dataModel 更新、并排编辑 surface。</li>
        <li><strong>CopilotKit Playground。</strong><a href="https://go.copilotkit.ai/a2ui-playground" target="_blank" rel="noopener">浏览器沙箱</a>，无需本地环境即可试用 A2UI 提示词与组件目录。</li>
        <li><strong>给你的编码智能体装上 A2UI 技能。</strong>在项目里运行下面这条命令，智能体就学会协议规则、SDK 集成与目录编写：</li>
      </ul>
      <app-code lang="bash" label="安装 A2UI agent skills" [code]="skillsCmd" />

      <h2 id="travel">运行 Travel A2UI</h2>
      <p>Travel A2UI 是一个刻意保持简单的旅行规划示例，位于
      <a href="https://github.com/a2ui-project/labs/tree/main/samples/travel-a2ui" target="_blank" rel="noopener">a2ui-project/labs</a> 仓库。
      一个 Python 服务器承载智能体与 API，在 <code>/</code> 提供 React 应用、在 <code>/flutter/</code> 提供 Flutter 应用。
      两个客户端都不懂旅行，它们只会画目录里的组件；目录里有什么由你决定，画什么由智能体决定。</p>

      <h2 id="architecture">A2UI 在这个应用里的位置</h2>
      <p>A2UI 既是<strong>智能体的 SDK</strong>，也是<strong>应用的渲染器</strong>。Travel A2UI 的结构如下：</p>
      <div class="not-prose mt-6 overflow-hidden rounded-xl border border-line-cool bg-card shadow-lift">
        <div class="bg-ink-900 px-5 py-4 text-white">
          <div class="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-blue-glow">
            <span class="h-1.5 w-1.5 rounded-full bg-blue-bright" aria-hidden="true"></span>
            SERVER · 你的智能体
          </div>
          <div class="mt-3 divide-y divide-white/10 border-t border-white/10 text-[12.5px] leading-relaxed">
            <div class="py-3">
              <p class="text-[13px] font-semibold text-white">SDK 配置</p>
              <p class="mt-1 text-white/60">
                <code class="whitespace-nowrap rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[11px] text-blue-glow sm:text-[11.5px]">catalogs/a2ui-travel/catalog.json</code>
                组件与函数目录
                <span class="mx-1 text-white/25">·</span>
                <code class="whitespace-nowrap rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[11px] text-blue-glow sm:text-[11.5px]">data/tools.json</code>
                业务工具(航班查询/预订)
              </p>
            </div>
            <div class="py-3">
              <p class="text-[13px] font-semibold text-blue-glow">A2UI Agent SDK</p>
              <div class="mt-1 grid gap-1 text-white/60">
                <p>
                  技能生成器
                  <code class="whitespace-nowrap rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[11px] text-blue-glow sm:text-[11.5px]">scripts/build_skills.py → skills/</code>
                  :目录 → 技能与语法规则
                </p>
                <p>
                  编译器/校验器
                  <code class="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[11px] text-blue-glow sm:text-[11.5px] sm:whitespace-nowrap sm:[overflow-wrap:normal]">apps/<wbr>server/<wbr>src/<wbr>travel_a2ui/<wbr>brain/<wbr>catalog.py</code>
                  :模型输出 → wire 消息
                </p>
              </div>
            </div>
            <div class="py-3">
              <p class="text-[13px] font-semibold text-white">你的智能体代码 + LLM 运行时(SDK 之外)</p>
              <p class="mt-1 text-white/60">
                <code class="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[11px] text-blue-glow sm:text-[11.5px] sm:whitespace-nowrap sm:[overflow-wrap:normal]">apps/<wbr>server/<wbr>src/<wbr>travel_a2ui/<wbr>brain/</code>
                调用工具与模型，把模型的 UI 输出交给编译器
              </p>
            </div>
          </div>
        </div>

        <div class="grid divide-y divide-line-warm border-y border-line-warm bg-paper/70 font-mono text-[11px] text-ink-soft sm:grid-cols-2 sm:divide-x sm:divide-y-0" aria-hidden="true">
          <p class="flex items-baseline gap-1.5 px-5 py-2.5">
            <span class="text-blue-deep">↓</span>
            <span>updateComponents / updateDataModel</span>
          </p>
          <p class="flex items-baseline gap-1.5 px-5 py-2.5">
            <span class="text-amber-deep">↑</span>
            <span>action <span class="text-ink-faint">(SSE)</span></span>
          </p>
        </div>

        <div class="px-5 py-4">
          <div class="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-ink-mute">
            <span class="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true"></span>
            CLIENT · 你的应用
          </div>
          <div class="mt-3 divide-y divide-line-warm border-t border-line-warm text-[12.5px] leading-relaxed">
            <div class="py-3">
              <p class="text-[13px] font-semibold text-ink">你的应用</p>
              <p class="mt-1 text-ink-soft">
                屏幕、导航、聊天；surface 之外都归你
                <code class="whitespace-nowrap rounded bg-mist px-1.5 py-0.5 font-mono text-[11px] text-ink sm:text-[11.5px]">apps/web · apps/flutter</code>
              </p>
            </div>
            <div class="py-3">
              <p class="text-[13px] font-semibold text-green-deep">A2UI 渲染器</p>
              <p class="mt-1 text-ink-soft">
                原生控件画 surface；绑定值本地更新；点击发回 action
                <code class="whitespace-nowrap rounded bg-green-tint px-1.5 py-0.5 font-mono text-[11px] text-green-deep sm:text-[11.5px]">renderers/react · renderers/flutter</code>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p>想边跑边读这五层链路，打开<a routerLink="/docs/walkthrough">分步详解</a>，对照屏幕上的每一块界面逐层理解。</p>

      <h3 id="requirements">环境要求</h3>
      <table>
        <thead><tr><th scope="col">依赖</th><th scope="col">版本</th><th scope="col">用途</th></tr></thead>
        <tbody>
          <tr><td>Python</td><td>3.11+</td><td>智能体服务器</td></tr>
          <tr><td>Node.js</td><td>20+</td><td>构建 React Web 客户端</td></tr>
          <tr><td>Flutter</td><td>3.38+</td><td>仅移动端需要</td></tr>
          <tr><td>Gemini API key</td><td>—</td><td>在 <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a> 免费获取，运行后粘贴到应用里</td></tr>
        </tbody>
      </table>

      <h3 id="commands">三条命令</h3>
      <app-code lang="bash" label="克隆并启动(Web + 移动端)" [code]="runCmd" />
      <p>quickstart.sh 的参数决定构建哪些客户端：</p>
      <table>
        <thead><tr><th scope="col">命令</th><th scope="col">构建内容</th></tr></thead>
        <tbody>
          <tr><td><code>./scripts/quickstart.sh both</code></td><td>React Web + Flutter 移动端</td></tr>
          <tr><td><code>./scripts/quickstart.sh react</code></td><td>仅 React Web</td></tr>
          <tr><td><code>./scripts/quickstart.sh flutter</code></td><td>仅 Flutter 移动端</td></tr>
        </tbody>
      </table>

      <h3 id="open">打开并体验</h3>
      <ol>
        <li>浏览器访问 <code>http://127.0.0.1:8080</code>(Flutter 端在 <code>/flutter/</code>)。</li>
        <li>按界面提示粘贴你的 Gemini API key，密钥只保存在本地会话。</li>
        <li>试着输入「帮我规划一个周末去东京的旅行」，观察智能体流式搭出卡片、日期选择与确认按钮。</li>
        <li>点击界面里的按钮，看 action 消息如何回到智能体并触发下一轮更新。</li>
      </ol>
      <p>想部署到公网，仓库里的 <code>./scripts/deploy.sh</code> 会把同一个服务器部署到 Google Cloud Run。</p>

      <h2 id="coding-agent">让编码智能体替你完成</h2>
      <p>官方把快速开始写成了可以直接粘贴给编码智能体的提示词(<a href="https://a2ui.org/quickstart/agent.md" target="_blank" rel="noopener">查看原文</a>),
      粘进 Antigravity、Claude Code、Codex、Cursor 或任何能读网页的编码智能体即可。它会跑三条命令，然后开着应用给你讲解 A2UI 如何工作。任选其一：</p>
      <app-code lang="bash" label="Web + 移动端(Python + React + Flutter)" [code]="promptBoth" />
      <app-code lang="bash" label="仅 Web(Python + React)" [code]="promptWeb" />
      <app-code lang="bash" label="仅移动端(Python + Flutter)" [code]="promptMobile" />

      <h2 id="learn">跑起来之后，你会学到什么</h2>
      <p>下面五点对应<a routerLink="/docs/walkthrough">分步详解</a>的五个章节，跑起来后对照屏幕阅读：</p>
      <ol>
        <li><strong>屏幕上哪些是 A2UI。</strong>surface、其中的组件、它们展示的数据，与普通应用代码的边界。</li>
        <li><strong>目录(Catalog)。</strong>智能体可用的组件与客户端函数，以及它为什么是安全护栏。</li>
        <li><strong>Agent skills。</strong>模型如何被教会为这个目录编写 A2UI。</li>
        <li><strong>模型写的与客户端收到的。</strong>A2UI Express 推理格式、SDK 编译出的协议消息、应用它们的 MessageProcessor。</li>
        <li><strong>渲染器。</strong>示例里的 React 与 Flutter 两个渲染器，以及 A2UI 的其他官方渲染器。</li>
      </ol>

      <blockquote>
        <p>Travel A2UI 是学习用的示例，不是生产模板。理解链路之后，用
        <a routerLink="/docs/renderers">客户端集成</a>与<a routerLink="/docs/agent-sdk">Agent 集成</a> 文档把 A2UI 接进你自己的应用。</p>
      </blockquote>
    </div>
  `,
})
export class QuickstartPage {
  protected readonly skillsCmd = 'bunx skills add a2ui-project/a2ui';
  protected readonly runCmd = `git clone https://github.com/a2ui-project/labs.git
cd labs/samples/travel-a2ui
./scripts/quickstart.sh both`;
  protected readonly promptBoth =
    'Follow the steps at https://a2ui.org/quickstart/agent.md to set up the A2UI quickstart web and mobile apps and explain them to me.';
  protected readonly promptWeb =
    'Follow the steps at https://a2ui.org/quickstart/agent/web.md to set up the A2UI quickstart web app and explain it to me.';
  protected readonly promptMobile =
    'Follow the steps at https://a2ui.org/quickstart/agent/mobile.md to set up the A2UI quickstart mobile app and explain it to me.';
}