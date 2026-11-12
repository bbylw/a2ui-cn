import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {RevealDirective} from '../shared/reveal.directive';

@Component({
  selector: 'app-ecosystem',
  imports: [RouterLink, RevealDirective],
  template: `
    <section class="relative bg-mist py-20 lg:py-28" id="ecosystem">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="max-w-2xl" appReveal>
          <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">生态与采用</h2>
          <p class="mt-4 text-base leading-relaxed text-ink-soft">
            渲染器、Agent SDK 与传输扩展全部开源。Google 发起,社区共建,
            已有团队在生产环境中使用 A2UI 构建智能体体验。
          </p>
        </div>

        <div class="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div class="overflow-hidden rounded-2xl border border-line-cool bg-white shadow-lift" appReveal>
            <table class="w-full text-sm">
              <caption class="sr-only">A2UI 官方包一览</caption>
              <thead>
                <tr class="border-b border-line-cool bg-mist text-left">
                  <th class="px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-ink-soft">语言</th>
                  <th class="px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-ink-soft">包</th>
                  <th class="hidden px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-ink-soft sm:table-cell">用途</th>
                </tr>
              </thead>
              <tbody>
                @for (group of packages; track group.lang) {
                  @for (pkg of group.items; track pkg.name; let first = $first) {
                    <tr class="border-b border-line-cool/60 transition-colors last:border-0 hover:bg-blue-tint/30">
                      @if (first) {
                        <td [attr.rowspan]="group.items.length" class="px-5 py-2.5 align-top font-semibold text-ink">
                          <span class="inline-flex items-center gap-2">
                            <span class="inline-block size-2 rounded-full {{ group.dot }}" aria-hidden="true"></span>
                            {{ group.lang }}
                          </span>
                        </td>
                      }
                      <td class="px-5 py-2.5 font-mono text-[13px] text-blue-deep">{{ pkg.name }}</td>
                      <td class="hidden px-5 py-2.5 text-ink-soft sm:table-cell">{{ pkg.desc }}</td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>

          <div class="grid content-start gap-6">
            <div class="rounded-2xl border border-line-cool bg-white p-6 shadow-lift" appReveal="120">
              <h3 class="font-display text-base font-bold text-ink">谁在用</h3>
              <ul class="mt-4 flex flex-wrap gap-2">
                @for (a of adopters; track a) {
                  <li class="rounded-lg border border-line-cool bg-mist px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-blue/40 hover:text-ink">{{ a }}</li>
                }
              </ul>
              <p class="mt-4 text-xs leading-relaxed text-ink-mute">
                Gemini 的生成式界面、Atlassian 与 Alation 的智能体产品、字节跳动的跨端实践,以及 AG-UI / CopilotKit 社区集成。
              </p>
            </div>
            <div class="rounded-2xl border border-line-cool bg-white p-6 shadow-lift" appReveal="200">
              <h3 class="font-display text-base font-bold text-ink">路线图</h3>
              <ul class="mt-4 grid gap-2.5 text-sm text-ink-soft">
                @for (item of roadmap; track item) {
                  <li class="flex gap-2.5">
                    <span class="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true"></span>
                    {{ item }}
                  </li>
                }
              </ul>
              <a routerLink="/docs/ecosystem" class="mt-4 inline-block text-sm font-semibold text-blue-deep underline decoration-blue-deep/30 underline-offset-4 hover:decoration-blue-deep">社区项目完整名单</a>
            </div>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-7xl px-4 sm:px-6" appReveal="260">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-deep via-blue to-blue-bright px-6 py-12 text-center shadow-panel sm:px-12">
          <div class="blueprint-dark absolute inset-0 opacity-40" aria-hidden="true"></div>
          <div class="absolute -right-16 -top-16 size-64 rounded-full bg-amber/20 blur-3xl" aria-hidden="true"></div>
          <div class="pointer-events-none absolute inset-0" aria-hidden="true">
            <span class="absolute left-[6%] top-6 hidden rounded-md border border-white/20 bg-white/10 px-2 py-1 font-mono text-[10px] text-white/70 animate-drift sm:block">createSurface</span>
            <span class="absolute right-[7%] top-10 hidden rounded-md border border-white/20 bg-white/10 px-2 py-1 font-mono text-[10px] text-white/70 animate-drift sm:block" style="animation-delay: -6s">updateComponents</span>
            <span class="absolute bottom-6 left-[12%] hidden rounded-md border border-white/20 bg-white/10 px-2 py-1 font-mono text-[10px] text-white/70 animate-drift sm:block" style="animation-delay: -10s">action</span>
          </div>
          <div class="relative">
            <h2 class="font-display text-2xl font-bold text-white sm:text-3xl">把生成式 UI 带进你的应用</h2>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80">
              五分钟跑通官方全栈示例,或直接在浏览器里把玩协议消息流。
            </p>
            <div class="mt-7 flex flex-wrap justify-center gap-3">
              <a routerLink="/docs/quickstart" class="pressable inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-bold text-blue-deep transition-all hover:-translate-y-0.5 hover:shadow-lift">阅读文档</a>
              <a href="https://github.com/a2ui-project/a2ui" target="_blank" rel="noopener"
                 class="pressable inline-flex h-11 items-center rounded-lg border border-white/40 px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10">Star on GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Ecosystem {
  protected readonly packages = [
    {
      lang: 'TypeScript',
      dot: 'bg-blue',
      items: [
        {name: '@a2ui/web_core', desc: '协议消息、状态、表达式与基础目录'},
        {name: '@a2ui/angular', desc: 'Angular 渲染器'},
        {name: '@a2ui/react', desc: 'React 渲染器'},
        {name: '@a2ui/lit', desc: 'Lit Web Components 渲染器'},
        {name: '@a2ui/agent', desc: 'Agent SDK:目录协商、提示词、编译'},
        {name: '@a2ui/catalog-mcp', desc: 'MCP 工具调用目录'},
      ],
    },
    {
      lang: 'Python',
      dot: 'bg-amber',
      items: [
        {name: 'a2ui-core', desc: '协议与数据绑定核心'},
        {name: 'a2ui-agent-sdk', desc: 'Agent SDK'},
        {name: 'a2ui-a2a / a2ui-adk', desc: 'A2A 与 Google ADK 集成'},
      ],
    },
    {
      lang: 'Dart / Swift / Kotlin',
      dot: 'bg-green',
      items: [
        {name: 'a2ui_flutter', desc: 'Flutter 渲染器(配合 a2ui_core)'},
        {name: 'A2UISwiftUI', desc: 'SwiftUI 渲染器(SPM 分发)'},
        {name: 'androidx.a2ui.compose', desc: 'Jetpack Compose 渲染器'},
      ],
    },
  ];
  protected readonly adopters = ['Google Gemini', 'Atlassian', 'Alation', 'ByteDance', 'AG-UI / CopilotKit', 'Flutter GenUI'];
  protected readonly roadmap = [
    '协议 v1.1:需求征集中',
    '跨框架模板引擎与标准原语',
    '沙箱化组件逻辑',
    'MCP Apps 与 A2UI 互相嵌入',
    'CLI:Schema 校验、代码生成、本地预览',
  ];
}