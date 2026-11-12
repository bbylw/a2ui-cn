import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {RevealDirective} from '../shared/reveal.directive';

@Component({
  selector: 'app-pipeline',
  imports: [RevealDirective, RouterLink],
  template: `
    <section class="relative overflow-hidden bg-mist py-16 lg:py-24" id="how">
      <div class="blueprint absolute inset-0 opacity-60" aria-hidden="true"></div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div class="max-w-2xl" appReveal>
          <p class="font-mono text-xs font-semibold uppercase tracking-widest text-blue-deep">架构管线</p>
          <h2 class="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">一次请求的旅程</h2>
          <p class="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
            从用户的一句话到可交互的原生界面，A2UI 把生成式 UI 拆成三段清晰的管线。
            以「柏林飞旧金山，今天出发，返程两张票」为例：
          </p>
        </div>

        <div class="mt-10 grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          <article class="relative flex flex-col rounded-2xl border border-line-cool bg-white p-6 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:border-red/40" appReveal>
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex size-10 items-center justify-center rounded-xl border border-red/20 bg-red-tint text-red">
                  <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/></svg>
                </span>
                <div>
                  <p class="font-mono text-xs uppercase tracking-wider text-ink-mute">Inference</p>
                  <h3 class="font-display text-lg font-bold text-ink">推理</h3>
                </div>
              </div>
              <span class="rounded-md border border-red/20 bg-red-tint px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-red-deep">01</span>
            </div>
            <p class="mt-4 text-pretty text-sm leading-relaxed text-ink-soft">
              智能体调用业务工具（航班查询），判断「此刻一个表单比一段文字更有用」，
              再让模型按目录生成的技能输出 Express DSL 或 JSON。
            </p>
            <div class="mt-auto pt-5">
              <div class="rounded-xl border border-line-dark bg-ink-950 p-3.5 font-mono text-xs leading-relaxed text-[#d7e2f4]">
                <span class="tok-com">&lt;a2ui&gt;</span><br />
                root = Card(Column([<br />
                &nbsp;&nbsp;FlightCard(price=$/out/price),<br />
                &nbsp;&nbsp;Button(<span class="tok-str">"确认预订"</span>)<br />
                ]))<br />
                <span class="tok-com">&lt;/a2ui&gt;</span>
              </div>
            </div>
          </article>

          <div class="flex justify-center lg:hidden" aria-hidden="true">
            <svg width="24" height="36" viewBox="0 0 24 36"><path d="M12 2v26" stroke="#1a73e8" stroke-width="2" stroke-dasharray="6 6" class="animate-flow"/><path d="M6 28l6 8 6-8z" fill="#1a73e8"/></svg>
          </div>

          <div class="hidden items-center lg:flex" aria-hidden="true">
            <svg width="44" height="24" viewBox="0 0 44 24"><path d="M2 12h34" stroke="#1a73e8" stroke-width="2" stroke-dasharray="6 6" class="animate-flow"/><path d="M36 6l8 6-8 6z" fill="#1a73e8"/></svg>
          </div>

          <article class="relative flex flex-col rounded-2xl border border-line-cool bg-white p-6 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:border-blue/45" appReveal="120">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex size-10 items-center justify-center rounded-xl border border-blue/20 bg-blue-tint text-blue">
                  <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12h6l2-7 4 14 2-7h2"/><circle cx="4" cy="12" r="1.6" fill="currentColor"/><circle cx="20" cy="12" r="1.6" fill="currentColor"/></svg>
                </span>
                <div>
                  <p class="font-mono text-xs uppercase tracking-wider text-ink-mute">Transport</p>
                  <h3 class="font-display text-lg font-bold text-ink">传输</h3>
                </div>
              </div>
              <span class="rounded-md border border-blue/25 bg-blue-tint px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-blue-deep">02</span>
            </div>
            <p class="mt-4 text-pretty text-sm leading-relaxed text-ink-soft">
              Agent SDK 边解析边校验：组件必须在目录里、属性必须符合 Schema。
              编译成 wire 消息后，经你选择的传输层送达客户端。
            </p>
            <div class="mt-auto pt-5">
              <div class="flex flex-wrap gap-1.5">
                @for (t of transports; track t) {
                  <span class="rounded-md border border-blue/20 bg-blue-tint px-2.5 py-1 font-mono text-xs font-medium text-blue-deep">{{ t }}</span>
                }
              </div>
              <p class="mt-3 rounded-lg border border-line-cool bg-mist/60 px-3 py-2 font-mono text-xs text-ink-soft">createSurface → updateComponents → updateDataModel</p>
            </div>
          </article>

          <div class="flex justify-center lg:hidden" aria-hidden="true">
            <svg width="24" height="36" viewBox="0 0 24 36"><path d="M12 2v26" stroke="#34a853" stroke-width="2" stroke-dasharray="6 6" class="animate-flow"/><path d="M6 28l6 8 6-8z" fill="#34a853"/></svg>
          </div>

          <div class="hidden items-center lg:flex" aria-hidden="true">
            <svg width="44" height="24" viewBox="0 0 44 24"><path d="M2 12h34" stroke="#34a853" stroke-width="2" stroke-dasharray="6 6" class="animate-flow"/><path d="M36 6l8 6-8 6z" fill="#34a853"/></svg>
          </div>

          <article class="relative flex flex-col rounded-2xl border border-line-cool bg-white p-6 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:border-green/45" appReveal="240">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex size-10 items-center justify-center rounded-xl border border-green/25 bg-green-tint text-green-deep">
                  <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M8 21h8"/></svg>
                </span>
                <div>
                  <p class="font-mono text-xs uppercase tracking-wider text-ink-mute">Rendering</p>
                  <h3 class="font-display text-lg font-bold text-ink">渲染</h3>
                </div>
              </div>
              <span class="rounded-md border border-green/25 bg-green-tint px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-green-deep">03</span>
            </div>
            <p class="mt-4 text-pretty text-sm leading-relaxed text-ink-soft">
              渲染器在 surface 中解析组件树、绑定数据模型，用原生控件绘制。
              用户改动本地即时生效；点击按钮才把 action 发回智能体。
            </p>
            <div class="mt-auto pt-5">
              <div class="grid gap-2 font-mono text-xs">
                <p class="rounded-lg border border-green/25 bg-green-tint px-3 py-1.5 text-[#1e6b34]">滑块 +1 → 本地更新 /outbound/pax</p>
                <p class="rounded-lg border border-amber/30 bg-amber-tint px-3 py-1.5 text-[#8a6400]">确认预订 → action: confirm_booking</p>
              </div>
            </div>
          </article>
        </div>

        <div class="relative mt-8 flex items-center justify-center" appReveal="300">
          <div class="absolute inset-x-6 top-1/2 hidden border-t-2 border-dashed border-amber/50 lg:block" aria-hidden="true"></div>
          <div class="relative inline-flex flex-wrap items-center justify-center gap-2.5 rounded-xl border border-amber/35 bg-white px-4 py-2.5 shadow-lift">
            <span class="inline-flex items-center gap-1.5 rounded-md bg-amber-tint px-2 py-0.5 font-mono text-xs font-semibold text-amber-deep">
              <span aria-hidden="true">↺</span>
              renderer → agent
            </span>
            <span class="text-sm font-medium text-ink-soft">action 沿原传输层回传，智能体继续下一轮生成</span>
          </div>
        </div>

        <p class="mt-10 text-center" appReveal="360">
          <a routerLink="/docs/concepts" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-deep underline decoration-blue-deep/30 underline-offset-4 transition-colors duration-300 hover:decoration-blue-deep">
            <span>深入了解核心概念</span>
            <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  `,
})
export class Pipeline {
  protected readonly transports = ['A2A', 'AG-UI', 'MCP', 'WebSocket', 'REST'];
}