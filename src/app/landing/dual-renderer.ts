import {AfterViewInit, Component, OnDestroy, computed, inject, signal} from '@angular/core';
import {A2uiRendererService, SurfaceComponent} from '@a2ui/angular';
import {ActionLogService} from '../core/action-log.service';
import {SCENARIOS} from '../core/scenarios';
import {formatContext} from '../core/format';
import {ReactIsland} from '../shared/react-island';
import {RevealDirective} from '../shared/reveal.directive';

@Component({
  selector: 'app-dual-renderer',
  imports: [SurfaceComponent, ReactIsland, RevealDirective],
  template: `
    <section class="grain relative overflow-hidden bg-ink-950 py-20 text-white lg:py-28" id="dual">
      <div class="blueprint-dark absolute inset-0" aria-hidden="true"></div>
      <div class="absolute -left-32 top-10 size-96 rounded-full bg-blue/12 blur-3xl animate-drift" aria-hidden="true"></div>
      <div class="absolute -right-24 bottom-0 size-80 rounded-full bg-green/8 blur-3xl" aria-hidden="true"></div>

      <div class="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div class="flex flex-wrap items-end justify-between gap-6" appReveal>
          <div class="max-w-2xl">
            <h2 class="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">同一份 JSON,两套渲染器</h2>
            <p class="mt-4 leading-relaxed text-ink-faint">
              下面两个界面由<strong class="font-semibold text-white">同一条消息流</strong>驱动:左侧走
              <code class="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-glow">&#64;a2ui/angular</code>
              的渲染服务与 Surface 组件,右侧走
              <code class="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-glow">&#64;a2ui/react</code>
              的 MessageProcessor。基础目录以通用 Web 组件实现,两套渲染器各自独立挂载、互不共享状态。填写表单、点击按钮,观察 action 实时回传。
            </p>
          </div>
          <button type="button" (click)="replay()"
                  class="pressable inline-flex h-10 items-center gap-2 rounded-lg border border-line-dark bg-ink-900 px-4 text-sm font-medium text-white transition-all hover:border-blue-bright hover:shadow-glow-blue">
            <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>
            重新放流
          </button>
        </div>

        <div class="mt-10 grid gap-6 lg:grid-cols-2">
          <div class="overflow-hidden rounded-2xl border border-line-dark bg-ink-900 shadow-panel transition-colors hover:border-red/50" appReveal>
            <div class="flex items-center gap-2.5 border-b border-line-dark px-5 py-3">
              <span class="inline-block size-2.5 rounded-full bg-red" aria-hidden="true"></span>
              <h3 class="font-display text-sm font-bold">Angular 渲染器</h3>
              <span class="ml-auto font-mono text-[10px] text-ink-faint">&#64;a2ui/angular · Surface 宿主</span>
            </div>
            <div class="a2ui-frame m-4 min-h-72 rounded-xl bg-white p-4 text-ink sm:m-5 sm:p-5">
              @if (ready()) {
                <a2ui-v09-surface surfaceId="restaurant-demo" />
              }
            </div>
          </div>

          <div class="overflow-hidden rounded-2xl border border-line-dark bg-ink-900 shadow-panel transition-colors hover:border-blue-bright/50" appReveal="140">
            <div class="flex items-center gap-2.5 border-b border-line-dark px-5 py-3">
              <span class="inline-block size-2.5 rounded-full bg-blue-bright" aria-hidden="true"></span>
              <h3 class="font-display text-sm font-bold">React 渲染器</h3>
              <span class="ml-auto font-mono text-[10px] text-ink-faint">&#64;a2ui/react · React 19</span>
            </div>
            <div class="a2ui-frame m-4 min-h-72 rounded-xl bg-white p-4 text-ink sm:m-5 sm:p-5">
              <app-react-island kind="surface" [islandProps]="reactProps()" />
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-2xl border border-line-dark bg-ink-900/80 p-5" appReveal="220">
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="font-mono text-xs font-semibold uppercase tracking-widest text-amber">action 回传日志</h3>
            <span class="font-mono text-[10px] text-ink-faint">renderer → agent</span>
            @if (actionLog.entries().length > 0) {
              <button type="button" (click)="actionLog.clear()"
                      class="ml-auto rounded-md border border-line-dark px-2.5 py-1 font-mono text-[11px] text-ink-faint transition-colors hover:border-red hover:text-[#ff8a80]">
                清空
              </button>
            }
          </div>
          @if (actionLog.entries().length === 0) {
            <p class="mt-3 text-sm text-ink-faint">还没有 action。点击任意一侧的「提交订位」按钮试试。</p>
          } @else {
            <ul class="mt-3 grid gap-2">
              @for (entry of actionLog.entries().slice(0, 4); track entry.id) {
                <li class="animate-rise flex flex-wrap items-center gap-2 rounded-lg border border-line-dark bg-ink-950 px-3 py-2 font-mono text-[11px]">
                  <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold {{ entry.from === 'angular' ? 'bg-red/15 text-[#ff8a80]' : 'bg-blue-bright/15 text-blue-glow' }}">{{ entry.from }}</span>
                  <span class="font-semibold text-amber">{{ entry.name }}</span>
                  <span class="text-ink-faint">← {{ entry.sourceComponentId }}</span>
                  <span class="min-w-0 flex-1 truncate text-white/50">{{ '{' }}{{ formatContext(entry.context) }}{{ '}' }}</span>
                  <span class="text-ink-faint">{{ entry.timestamp.slice(11, 19) }}</span>
                </li>
              }
            </ul>
          }
        </div>
      </div>
    </section>
  `,
})
export class DualRenderer implements AfterViewInit, OnDestroy {
  private readonly renderer = inject(A2uiRendererService);
  protected readonly actionLog = inject(ActionLogService);
  private readonly scenario = SCENARIOS[1];
  private readonly resetToken = signal(0);
  // The Angular surface host must not mount before processMessages() creates it.
  protected readonly ready = signal(false);

  protected readonly reactProps = computed(() => ({
    messages: structuredClone(this.scenario.messages),
    resetKey: this.resetToken(),
    onAction: (action: Record<string, unknown>) => this.actionLog.add(action, 'react'),
  }));

  ngAfterViewInit(): void {
    this.renderer.processMessages(structuredClone(this.scenario.messages));
    this.ready.set(true);
  }

  ngOnDestroy(): void {
    this.renderer.processMessages([{version: '1.0', deleteSurface: {surfaceId: 'restaurant-demo'}}]);
  }

  protected replay(): void {
    this.renderer.processMessages([{version: '1.0', deleteSurface: {surfaceId: 'restaurant-demo'}}]);
    this.renderer.processMessages(structuredClone(this.scenario.messages));
    this.resetToken.update(t => t + 1);
  }

  protected readonly formatContext = formatContext;
}