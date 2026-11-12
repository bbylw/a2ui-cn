import {Component} from '@angular/core';
import {DocsPageHeader} from '../../shared/docs-page-header';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../../shared/code-block';

@Component({
  selector: 'app-docs-walkthrough',
  imports: [DocsPageHeader, RouterLink, CodeBlock],
  template: `
    <app-docs-page-header eyebrow="入门 / 分步详解" heading="分步详解">
        边跑边读。先按<a routerLink="/docs/quickstart">快速开始</a>把 Travel A2UI 跑起来,
        然后对照屏幕上的每一块界面,理解 A2UI 的五层链路:边界、目录、技能、推理格式与渲染器。
    </app-docs-page-header>

    <div class="doc-prose">
      <blockquote>
        <p>本页对应官方 <a href="https://a2ui.org/quickstart/step-by-step/" target="_blank" rel="noopener">Step-by-Step Walkthrough</a>。
        示例应用位于 <a href="https://github.com/a2ui-project/labs/tree/main/samples/travel-a2ui" target="_blank" rel="noopener">a2ui-project/labs</a>,
        是学习用途,不是生产模板。</p>
      </blockquote>

      <h2 id="run">先跑起来</h2>
      <p>一个 Python 服务器同时承载智能体与 API,在 <code>/</code> 提供 React Web 端、在 <code>/flutter/</code> 提供 Flutter 移动端:</p>
      <app-code lang="bash" label="克隆并启动" [code]="runCmd" />
      <p>脚本依次检查环境、安装依赖、构建客户端并启动服务器,输出大致如下(你的版本号可能不同):</p>
      <app-code lang="text" label="预期启动输出" [code]="startupOutput" />
      <p>打开 <code>http://127.0.0.1:8080</code>(移动端在 <code>/flutter/</code>)。
      Web 端落地即是一段录好的示例行程,<strong>不需要密钥</strong>;想真正对话,再从
      <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">AI Studio</a> 粘贴一个免费 Gemini key(只保存在浏览器)。
      试着输入「四月去马德里六天,两个人,预算 2500 美元」,移动端可以试「五月从 JFK 出发去里斯本过周末,两个人」。两个应用收到同样的消息,只是由两个渲染器各自绘制。</p>

      <h2 id="boundary">1 · 哪些是 A2UI,哪些是应用代码</h2>
      <p>屏幕上不是所有东西都来自智能体。蓝色区域由智能体逐轮组合,灰色区域是你写的应用代码,每轮都保持不变:</p>
      <div class="not-prose mt-5 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border border-blue/30 bg-blue-tint p-5">
          <div class="font-display text-sm font-bold text-blue-deep">A2UI(智能体组合)</div>
          <ul class="mt-3 grid gap-1.5 text-[13px] leading-relaxed text-ink-soft">
            <li>对话里的行程卡片</li>
            <li>行程面板 / 移动端 sheet</li>
            <li>Web 端 Home 仪表盘</li>
          </ul>
        </div>
        <div class="rounded-xl border border-line-cool bg-mist p-5">
          <p class="font-display text-sm font-bold text-ink">应用代码(你编写)</p>
          <ul class="mt-3 grid gap-1.5 text-[13px] leading-relaxed text-ink-soft">
            <li>头部 / 标签栏、输入框、聊天气泡</li>
            <li>密钥表单</li>
            <li>Catalog 与 Wire 调试标签</li>
          </ul>
        </div>
      </div>
      <p>每一块蓝色区域是一个 <strong>surface</strong>(智能体控制的一块界面),由<strong>组件</strong>(<code>Text</code>、<code>Button</code>、<code>FlightOption</code>)构成,
      组件的值来自该 surface 的<strong>数据模型</strong>;点击航班则发回一条 <strong>action</strong>。
      经验法则:固定 UI 自己写,依赖请求内容而变化的部分交给智能体组合。</p>

      <h2 id="catalog">2 · 目录:智能体能画什么</h2>
      <p>目录(<code>catalogs/a2ui-travel/catalog.json</code>)声明两类东西:</p>
      <ul>
        <li><strong>组件</strong>及其属性。基础目录提供 <code>Text</code>、<code>Row</code>、<code>Column</code>、<code>List</code>、<code>Button</code>、<code>TextField</code>;
        本应用追加 <code>FlightOption</code>、<code>HotelCard</code>、<code>DateRangePicker</code>、<code>PriceSummary</code>。</li>
        <li><strong>函数</strong>,在客户端运行。基础目录有 <code>formatCurrency</code>、<code>formatDate</code>、<code>pluralize</code>、<code>required</code>;
        本应用追加 <code>calcNights</code>、<code>equals</code>。例如一条绑定:</li>
      </ul>
      <app-code lang="text" label="客户端函数绑定" [code]="bindingSnippet" />
      <p>应用里的 Catalog 标签会用真实渲染器把每个组件画出来。目录是<strong>护栏</strong>:服务器对模型的每条消息做校验,每个客户端都实现目录里的全部内容。</p>
      <div class="not-prose mt-5 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border border-line-cool bg-card p-5">
          <p class="font-display text-sm font-bold text-ink">模型决定</p>
          <ul class="mt-3 grid gap-1.5 text-[13px] leading-relaxed text-ink-soft">
            <li>是否展示某张卡片</li>
            <li>用哪些组件、如何布局</li>
            <li>措辞与下一个问题</li>
          </ul>
        </div>
        <div class="rounded-xl border border-line-cool bg-card p-5">
          <p class="font-display text-sm font-bold text-ink">你决定</p>
          <ul class="mt-3 grid gap-1.5 text-[13px] leading-relaxed text-ink-soft">
            <li>目录里有哪些组件与函数</li>
            <li>数据、校验规则</li>
            <li>一次点击记录什么</li>
          </ul>
        </div>
      </div>

      <h2 id="skills">3 · 技能:教会模型写 A2UI</h2>
      <p><strong>技能(skill)</strong>是一段 Markdown,教模型为某个目录编写 A2UI。本应用在 <code>skills/express-modular/</code> 下有两个:
      <code>a2ui-core</code>(记法)与 <code>a2ui-travel</code>(目录)。其中一条会描述组件签名,例如:</p>
      <app-code lang="text" label="技能中的组件签名(节选)" [code]="skillSnippet" />
      <p>技能由 <code>SkillGenerator</code> 生成(<code>scripts/build_skills.py</code>);运行 <code>npm run generate</code> 可让技能与目录保持同步。</p>

      <h2 id="wire">4 · 模型写的 vs 客户端收到的</h2>
      <p>模型写的是 <strong>A2UI Express</strong>,<code>root</code> 在前:</p>
      <app-code lang="text" label="模型输出(Express)" [code]="expressSnippet" />
      <p><strong>Agent SDK</strong> 把 Express 流式解析、校验,编译成标准 JSON 消息:
      <code>createSurface</code>、<code>updateComponents</code>、<code>updateDataModel</code>、<code>deleteSurface</code>。
      上面的 Express 编译后,组件列表大致是(<code>List</code> 用模板从数据模型展开):</p>
      <app-code lang="json" label="客户端收到的 wire 消息(节选)" [code]="wireSnippet" />
      <p>客户端的 <strong>MessageProcessor</strong> 应用这些消息:维护组件与数据、解析绑定、运行函数、发回 action。
      React 端用 <code>@a2ui/web_core</code>(<code>apps/web/src/surfaces.ts</code>),Flutter 端用 <code>a2ui_core</code>(<code>apps/flutter/lib/chat.dart</code>)。
      应用里的 Wire 标签把 Express 与收到的 JSON 并排展示。Express 只是一种紧凑记法,A2UI 本身是 JSON。</p>

      <h2 id="renderers">5 · 渲染器</h2>
      <p><strong>渲染器</strong>用原生控件实现目录组件,并通过 MessageProcessor 应用消息;它不持有应用逻辑。
      本应用里是 React(<code>@a2ui/react</code> + <code>@a2ui/web_core</code>,<code>renderers/react/</code>)与
      Flutter(<code>a2ui_flutter</code> + <code>a2ui_core</code>,<code>renderers/flutter/</code>)。</p>
      <ul>
        <li><strong>官方渲染器:</strong>Lit、Angular、React、Flutter、SwiftUI、Jetpack Compose、Markdown。</li>
        <li><strong>社区渲染器:</strong>UIKit、React Native、Vue、Lynx、终端等。</li>
      </ul>
      <p>服务器从不知道客户端是什么;新增一个平台,只需要为同一份目录写一个渲染器。详见<a routerLink="/docs/renderers">客户端集成</a>。</p>

      <h2 id="deploy">部署到 Cloud Run</h2>
      <p>想部署到自己的 GCP 项目(需启用计费),在已登录 gcloud 的克隆里运行:</p>
      <app-code lang="bash" label="部署到 Cloud Run" [code]="deployCmd" />
      <p>脚本会启用所需服务、构建并部署(首次约 10 分钟),最后打印 URL。服务器不存储密钥,每位访客粘贴自己的 key。
      不想配本地环境,也可以用 Google Cloud Shell:打开即带示例与终端旁的简短指南,登录、选择项目、运行一个脚本即可。</p>

      <h2 id="next">继续深入</h2>
      <div class="not-prose mt-6 grid gap-3 sm:grid-cols-2">
        <a routerLink="/docs/concepts" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">核心概念</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">把本页的五层链路抽象成通用心智模型。</span>
        </a>
        <a routerLink="/docs/messages" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">消息参考</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">四种核心消息与双向函数调用的完整字段。</span>
        </a>
        <a routerLink="/docs/agent-sdk" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">Agent 集成</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">目录协商、技能生成、推理格式与有状态校验。</span>
        </a>
        <a routerLink="/docs/renderers" class="group rounded-xl border border-line-cool bg-card p-5 shadow-lift transition-all hover:-translate-y-0.5 hover:border-blue/50">
          <span class="font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">客户端集成</span>
          <span class="mt-1.5 block text-[13px] leading-relaxed text-ink-soft">把 A2UI 接进你自己的 Web 或移动端应用。</span>
        </a>
      </div>
    </div>
  `,
})
export class WalkthroughPage {
  protected readonly runCmd = `git clone https://github.com/a2ui-project/labs
cd labs/samples/travel-a2ui
./scripts/quickstart.sh both`;
  protected readonly startupOutput = `→ Checking what is installed
  Python 3.11.18
  node v22.23.4
→ The Python server
  installed into .venv
→ The React client
  ✓ built in 456ms
→ The Flutter client
  ✓ Built build/web
→ Starting on port 8080
  React:   http://127.0.0.1:8080
  Flutter: http://127.0.0.1:8080/flutter/
  No GEMINI_API_KEY set: paste a key into the app when it asks.`;
  protected readonly bindingSnippet =
    '"\${calcNights(start: \${/trip/startDate}, end: \${/trip/endDate})} nights"';
  protected readonly skillSnippet =
    'FlightOption(airline, departTime, arriveTime, origin, destination, price, action, duration?, stops?, flightNumber?, …)';
  protected readonly expressSnippet = `root = Column([head, list])
head = Text("### Flights to Madrid")
list = List(_template($/flights, fare))
fare = FlightOption($airline, $departTime, $arriveTime, $origin, $destination, $price, Event("select_flight", {id: $id}))`;
  protected readonly wireSnippet = `{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "trip",
    "components": [
      {"id": "root", "component": "Column", "children": ["head", "list"]},
      {"id": "head", "component": "Text", "text": "### Flights to Madrid"},
      {"id": "list", "component": "List", "children": {"componentId": "fare", "path": "/flights"}},
      {
        "id": "fare",
        "component": "FlightOption",
        "airline": {"@path": "airline"},
        "price": {"@path": "price"},
        "action": {"event": {"name": "select_flight", "context": {"id": {"@path": "id"}}}}
      }
    ]
  }
}`;
  protected readonly deployCmd = './scripts/deploy.sh';
}
