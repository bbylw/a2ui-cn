import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-quickstart',
  imports: [RouterLink, CodeBlock],
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-mute">入门 / 快速开始</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">快速开始</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        两条路径:不装任何东西,用在线工具立刻体验;或者三条命令,在本地跑起官方的
        Travel A2UI 示例:一个 Python 智能体服务器,同时服务 React Web 端与 Flutter 移动端。
      </p>
    </header>

    <div class="doc-prose">
      <h2 id="no-install">零安装体验</h2>
      <ul>
        <li><strong>本站 Playground。</strong><a routerLink="/playground">打开 Playground</a>,逐条播放航班预订、餐厅订位、实时仪表盘三个场景的协议消息,还能编辑 JSON 自己发消息。</li>
        <li><strong>A2UI Composer。</strong><a href="https://a2ui-editor.ag-ui.com" target="_blank" rel="noopener">a2ui-editor.ag-ui.com</a> 是官方可视化工作台:向助手提需求、查看流式消息与 dataModel 更新、并排编辑 surface。</li>
        <li><strong>CopilotKit Playground。</strong><a href="https://go.copilotkit.ai/a2ui-playground" target="_blank" rel="noopener">浏览器沙箱</a>,无需本地环境即可试用 A2UI 提示词与组件目录。</li>
        <li><strong>给你的编码智能体装上 A2UI 技能。</strong>在项目里运行下面这条命令,智能体就学会协议规则、SDK 集成与目录编写:</li>
      </ul>
      <app-code lang="bash" label="安装 A2UI agent skills" [code]="skillsCmd" />

      <h2 id="travel">运行 Travel A2UI</h2>
      <p>Travel A2UI 是一个刻意保持简单的旅行规划示例,位于
      <a href="https://github.com/a2ui-project/labs/tree/main/samples/travel-a2ui" target="_blank" rel="noopener">a2ui-project/labs</a> 仓库。
      一个 Python 服务器承载智能体与 API,在 <code>/</code> 提供 React 应用、在 <code>/flutter/</code> 提供 Flutter 应用。
      两个客户端都不懂旅行,它们只会画目录里的组件;目录里有什么由你决定,画什么由智能体决定。</p>

      <h3 id="requirements">环境要求</h3>
      <table>
        <thead><tr><th>依赖</th><th>版本</th><th>用途</th></tr></thead>
        <tbody>
          <tr><td>Python</td><td>3.11+</td><td>智能体服务器</td></tr>
          <tr><td>Node.js</td><td>20+</td><td>构建 React Web 客户端</td></tr>
          <tr><td>Flutter</td><td>3.38+</td><td>仅移动端需要</td></tr>
          <tr><td>Gemini API key</td><td>—</td><td>在 <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a> 免费获取,运行后粘贴到应用里</td></tr>
        </tbody>
      </table>

      <h3 id="commands">三条命令</h3>
      <app-code lang="bash" label="克隆并启动(Web + 移动端)" [code]="runCmd" />
      <p>quickstart.sh 的参数决定构建哪些客户端:</p>
      <table>
        <thead><tr><th>命令</th><th>构建内容</th></tr></thead>
        <tbody>
          <tr><td><code>./scripts/quickstart.sh both</code></td><td>React Web + Flutter 移动端</td></tr>
          <tr><td><code>./scripts/quickstart.sh react</code></td><td>仅 React Web</td></tr>
          <tr><td><code>./scripts/quickstart.sh flutter</code></td><td>仅 Flutter 移动端</td></tr>
        </tbody>
      </table>

      <h3 id="open">打开并体验</h3>
      <ol>
        <li>浏览器访问 <code>http://127.0.0.1:8080</code>(Flutter 端在 <code>/flutter/</code>)。</li>
        <li>按界面提示粘贴你的 Gemini API key,密钥只保存在本地会话。</li>
        <li>试着输入「帮我规划一个周末去东京的旅行」,观察智能体流式搭出卡片、日期选择与确认按钮。</li>
        <li>点击界面里的按钮,看 action 消息如何回到智能体并触发下一轮更新。</li>
      </ol>
      <p>想部署到公网,仓库里的 <code>./scripts/deploy.sh</code> 会把同一个服务器部署到 Google Cloud Run。</p>

      <h2 id="coding-agent">让编码智能体替你完成</h2>
      <p>官方把快速开始写成了可以直接粘贴给编码智能体的提示词,任选其一:</p>
      <app-code lang="bash" label="Web + 移动端(Python + React + Flutter)" [code]="promptBoth" />
      <app-code lang="bash" label="仅 Web(Python + React)" [code]="promptWeb" />
      <app-code lang="bash" label="仅移动端(Python + Flutter)" [code]="promptMobile" />

      <h2 id="learn">跑起来之后,你会学到什么</h2>
      <ol>
        <li><strong>屏幕上哪些是 A2UI。</strong>surface、其中的组件、它们展示的数据,与普通应用代码的边界。</li>
        <li><strong>目录(Catalog)。</strong>智能体可用的组件与客户端函数,以及它为什么是安全护栏。</li>
        <li><strong>Agent skills。</strong>模型如何被教会为这个目录编写 A2UI。</li>
        <li><strong>模型写的与客户端收到的。</strong>A2UI Express 推理格式、SDK 编译出的协议消息、应用它们的 MessageProcessor。</li>
        <li><strong>渲染器。</strong>示例里的 React 与 Flutter 两个渲染器,以及 A2UI 的其他官方渲染器。</li>
      </ol>

      <blockquote>
        <p>Travel A2UI 是学习用的示例,不是生产模板。理解链路之后,用
        <a routerLink="/docs/renderers">渲染器</a>与<a routerLink="/docs/agent-sdk">Agent SDK</a> 文档把 A2UI 接进你自己的应用。</p>
      </blockquote>
    </div>
  `,
})
export class QuickstartPage {
  protected readonly skillsCmd = 'npx skills add a2ui-project/a2ui';
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