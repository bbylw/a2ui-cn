import {Component} from '@angular/core';
import {RevealDirective} from '../shared/reveal.directive';

@Component({
  selector: 'app-philosophy',
  imports: [RevealDirective],
  template: `
    <section class="relative bg-paper py-16 lg:py-24" id="why">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="max-w-2xl" appReveal>
          <p class="font-mono text-xs font-semibold uppercase tracking-widest text-blue-deep">设计哲学</p>
          <h2 class="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">为什么是 A2UI</h2>
          <p class="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
            生成式 UI 的老问题：要么让模型直接写代码（不安全），要么只能返回死板的工具卡片（不灵活）。A2UI 用一份声明式协议同时解决两者。
          </p>
        </div>

        <div class="mt-12 grid gap-10 lg:gap-14">
          <article class="grid items-center gap-8 lg:grid-cols-2" appReveal>
            <div>
              <span class="flex size-11 items-center justify-center rounded-xl border border-blue/20 bg-blue-tint text-blue">
                <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2L4 6v6c0 5.2 3.4 9.8 8 11 4.6-1.2 8-5.8 8-11V6l-8-4z"/><path d="M9 12l2 2 4-4"/></svg>
              </span>
              <h3 class="mt-4 font-display text-2xl font-bold text-ink">安全优先：目录即边界</h3>
              <p class="mt-3 text-pretty leading-relaxed text-ink-soft">
                应用开发者通过组件目录（Catalog）声明智能体「能画什么」。每个组件的属性都有 JSON Schema，
                Agent SDK 在编译期逐一校验。智能体只能发送结构化数据，客户端永远不执行不可信代码。
              </p>
            </div>
            <div class="rounded-2xl border border-line-warm bg-white p-6 shadow-lift">
              <div class="flex items-center justify-between border-b border-line-warm pb-3">
                <span class="font-mono text-xs font-semibold text-ink-soft">catalog.json · 白名单契约</span>
                <span class="rounded border border-green/25 bg-green-tint px-2 py-0.5 font-mono text-xs font-semibold text-[#1e6b34]">Schema 校验</span>
              </div>
              <div class="pop mt-4 flex flex-wrap gap-2">
                @for (ok of allowed; track ok) {
                  <span class="inline-flex items-center gap-1.5 rounded-lg border border-green/25 bg-green-tint px-3 py-1.5 font-mono text-xs font-medium text-[#1e6b34]">
                    <svg viewBox="0 0 16 16" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 5"/></svg>
                    {{ ok }}
                  </span>
                }
              </div>
              <div class="pop mt-3 flex flex-wrap gap-2 border-t border-dashed border-line-warm pt-3">
                @for (no of blocked; track no) {
                  <span class="inline-flex items-center gap-1.5 rounded-lg border border-red/25 bg-red-tint px-3 py-1.5 font-mono text-xs font-medium text-red-deep line-through decoration-red/50">
                    {{ no }}
                  </span>
                }
              </div>
            </div>
          </article>

          <article class="grid items-center gap-8 lg:grid-cols-2" appReveal>
            <div class="order-2 rounded-2xl border border-line-cool bg-mist p-6 shadow-lift lg:order-1">
              <div class="flex items-center justify-between border-b border-line-cool pb-3">
                <span class="font-mono text-xs font-semibold text-ink-soft">渐进式渲染 · 边生成边可见</span>
                <span class="font-mono text-xs text-ink-mute">Streaming JSONL</span>
              </div>
              <div class="mt-5 grid gap-4">
                @for (stage of stages; track stage.label) {
                  <div>
                    <div class="flex items-center justify-between font-mono text-xs text-ink-soft">
                      <span>{{ stage.label }}</span><span class="tabular-nums font-semibold">{{ stage.pct }}%</span>
                    </div>
                    <div class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white">
                      <div class="grow-bar h-full rounded-full {{ stage.bar }}" [attr.style]="'--bar-w: ' + stage.pct + '%'"></div>
                    </div>
                  </div>
                }
              </div>
              <p class="mt-5 text-xs leading-relaxed text-ink-soft">消息按到达顺序处理：先出骨架，再填组件，最后补数据。用户无需等待完整响应。</p>
            </div>
            <div class="order-1 lg:order-2">
              <span class="flex size-11 items-center justify-center rounded-xl border border-amber/25 bg-amber-tint text-amber-deep">
                <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>
              </span>
              <h3 class="mt-4 font-display text-2xl font-bold text-ink">模型友好，流式渐进</h3>
              <p class="mt-3 text-pretty leading-relaxed text-ink-soft">
                扁平的组件邻接表 + 独立的数据模型，让模型可以增量输出、随时修正。配合 Express 等紧凑推理格式，
                token 更省、首屏更快；数据更新只发一条 <code class="rounded bg-blue-tint px-1.5 py-0.5 font-mono text-xs font-medium text-blue-deep">updateDataModel</code>，不必重发界面。
              </p>
            </div>
          </article>

          <article class="grid items-center gap-8 lg:grid-cols-2" appReveal>
            <div>
              <span class="flex size-11 items-center justify-center rounded-xl border border-green/25 bg-green-tint text-green-deep">
                <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>
              </span>
              <h3 class="mt-4 font-display text-2xl font-bold text-ink">原生渲染，跨平台一致</h3>
              <p class="mt-3 text-pretty leading-relaxed text-ink-soft">
                渲染器把组件映射为宿主框架的原生控件：React 元素、Angular 组件、Flutter Widget、SwiftUI 视图……
                品牌样式、无障碍与交互习惯全部保留。同一个智能体，一次输出，覆盖 Web、移动端与桌面。
              </p>
            </div>
            <div class="rounded-2xl border border-line-dark bg-ink-900 p-6 shadow-panel">
              <div class="flex items-center justify-between border-b border-line-dark pb-3">
                <span class="font-mono text-xs text-ink-faint">updateComponents · 同一份 JSON</span>
                <span class="font-mono text-xs text-blue-glow">v1.0</span>
              </div>
              <pre class="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-[#d7e2f4]"><code>{{ '{' }}
  <span class="tok-key">"id"</span>: <span class="tok-str">"confirm"</span>,
  <span class="tok-key">"component"</span>: <span class="tok-str">"Button"</span>,
  <span class="tok-key">"variant"</span>: <span class="tok-str">"primary"</span>
{{ '}' }}</code></pre>
              <div class="mt-4 grid grid-cols-3 gap-2 border-t border-line-dark pt-4">
                @for (f of frameworks; track f.name) {
                  <div class="rounded-lg border border-line-dark bg-ink-800 px-3 py-2.5 text-center transition-colors duration-300 hover:border-blue-bright/50">
                    <p class="inline-flex items-center gap-1.5 font-mono text-xs text-ink-faint">
                      <span class="inline-block size-1.5 rounded-full {{ f.dot }}" aria-hidden="true"></span>
                      {{ f.name }}
                    </p>
                    <p class="mt-1 font-mono text-xs font-semibold text-white">{{ f.widget }}</p>
                  </div>
                }
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
})
export class Philosophy {
  protected readonly allowed = ['Text', 'Card', 'Button', 'Slider', 'TextField', 'Tabs'];
  protected readonly blocked = ['eval()', '<script>', '任意 JS', 'iframe 注入'];
  protected readonly stages = [
    {label: 'createSurface · 骨架', pct: 25, bar: 'bg-blue-bright'},
    {label: 'updateComponents · 组件', pct: 70, bar: 'bg-blue'},
    {label: 'updateDataModel · 数据', pct: 100, bar: 'bg-green'},
  ];
  protected readonly frameworks = [
    {name: 'React', widget: '<button>', dot: 'bg-blue-bright'},
    {name: 'Angular', widget: 'Surface 组件', dot: 'bg-red'},
    {name: 'Flutter', widget: 'FilledButton', dot: 'bg-green'},
  ];
}