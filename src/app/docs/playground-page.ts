import {Component, OnDestroy, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {A2uiRendererService, SurfaceComponent} from '@a2ui/angular';
import {ActionLogService} from '../core/action-log.service';
import {SCENARIOS} from '../core/scenarios';
import {formatContext} from '../core/format';
import {ReactIsland} from '../shared/react-island';

interface StreamState {
  scenarioId: string;
  resetToken: number;
  messages: Record<string, unknown>[];
}

@Component({
  selector: 'app-playground-page',
  imports: [RouterLink, SurfaceComponent, ReactIsland],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header class="mb-8 max-w-3xl">
        <p class="font-mono text-xs text-ink-mute">实践 / Playground</p>
        <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">协议 Playground</h1>
        <p class="mt-4 leading-relaxed text-ink-soft">
          左侧控制台逐条发送真实的 A2UI v1.0 消息,右侧两套渲染器同时渲染:
          <strong class="font-semibold text-ink">&#64;a2ui/angular</strong> 与
          <strong class="font-semibold text-ink">&#64;a2ui/react</strong>,各自独立维护 surface 状态。
          暂停、单步、跳转到任意消息,或在 JSON 编辑器里写自己的消息流。
          点击界面里的按钮,action 会出现在下方日志中。
        </p>
      </header>

      <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        <app-react-island kind="playground" class="min-w-0" [islandProps]="consoleProps" />

        <div class="grid min-w-0 gap-6">
          @if (showAngular()) {
            <section class="overflow-hidden rounded-2xl border border-line-dark bg-ink-900 shadow-panel">
              <div class="flex items-center gap-2.5 border-b border-line-dark px-5 py-3">
                <span class="inline-block size-2.5 rounded-full bg-red" aria-hidden="true"></span>
                <h2 class="font-display text-sm font-bold text-white">Angular 渲染器</h2>
                <span class="ml-auto font-mono text-[10px] text-ink-faint">&#64;a2ui/angular · v1.0</span>
              </div>
              <div class="a2ui-frame m-4 min-h-64 rounded-xl bg-white p-4 text-ink sm:m-5 sm:p-5">
                @if (angularError(); as err) {
                  <div role="alert" class="rounded-lg border border-red/30 bg-red-tint px-3 py-2 font-mono text-xs text-red-deep">渲染错误:{{ err }}</div>
                }
                @if (angularReady()) {
                  @if (surfaceId(); as sid) {
                    <a2ui-v09-surface [surfaceId]="sid" />
                  }
                } @else if (!angularError()) {
                  <div class="grid gap-3" aria-hidden="true">
                    <div class="h-5 w-2/5 animate-pulse rounded bg-mist"></div>
                    <div class="h-20 animate-pulse rounded-lg bg-mist"></div>
                    <div class="h-9 animate-pulse rounded-lg bg-mist"></div>
                  </div>
                }
              </div>
            </section>
          }

          @if (showReact()) {
            <section class="overflow-hidden rounded-2xl border border-line-dark bg-ink-900 shadow-panel">
              <div class="flex items-center gap-2.5 border-b border-line-dark px-5 py-3">
                <span class="inline-block size-2.5 rounded-full bg-blue-bright" aria-hidden="true"></span>
                <h2 class="font-display text-sm font-bold text-white">React 渲染器</h2>
                <span class="ml-auto font-mono text-[10px] text-ink-faint">&#64;a2ui/react · React 19</span>
              </div>
              <div class="a2ui-frame m-4 min-h-64 rounded-xl bg-white p-4 text-ink sm:m-5 sm:p-5">
                <app-react-island kind="surface" [islandProps]="reactPreviewProps()" />
              </div>
            </section>
          }

          @if (!showAngular() && !showReact()) {
            <div class="rounded-2xl border border-dashed border-line-cool bg-card p-8 text-center text-sm text-ink-soft">
              两个预览都已关闭。打开控制台里的「Angular 预览」或「React 预览」开关即可恢复。
            </div>
          }

          <section class="rounded-2xl border border-line-cool bg-card p-5 shadow-lift">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="font-mono text-xs font-semibold tracking-widest text-blue-deep uppercase">action 回传日志</h2>
              <span class="font-mono text-[10px] text-ink-mute">renderer → agent</span>
              @if (actionLog.entries().length > 0) {
                <button type="button" (click)="actionLog.clear()"
                        class="ml-auto rounded-md border border-line-cool px-2.5 py-1 font-mono text-[11px] text-ink-soft transition-colors hover:border-red hover:text-red-deep">
                  清空
                </button>
              }
            </div>
            @if (actionLog.entries().length === 0) {
              <p class="mt-3 text-sm text-ink-soft">还没有 action。等消息流播放出按钮后,点击任意一侧界面上的按钮试试。</p>
            } @else {
              <ul class="mt-3 grid gap-2">
                @for (entry of actionLog.entries().slice(0, 6); track entry.id) {
                  <li class="flex flex-wrap items-center gap-2 rounded-lg border border-line-cool bg-mist/50 px-3 py-2 font-mono text-[11px]">
                    <span class="rounded px-1.5 py-0.5 text-[10px] font-semibold {{ entry.from === 'angular' ? 'bg-red-tint text-red-deep' : 'bg-blue-tint text-blue-deep' }}">{{ entry.from }}</span>
                    <span class="font-semibold text-ink">{{ entry.name }}</span>
                    <span class="text-ink-mute">来自 {{ entry.sourceComponentId }}</span>
                    <span class="min-w-0 flex-1 truncate text-ink-soft">{{ '{' }}{{ formatContext(entry.context) }}{{ '}' }}</span>
                    <span class="text-ink-mute">{{ entry.timestamp.slice(11, 19) }}</span>
                  </li>
                }
              </ul>
            }
          </section>

          <p class="text-xs leading-relaxed text-ink-mute">
            消息与组件 schema 均符合 v1.0 基础目录。想系统了解这些消息,阅读
            <a routerLink="/docs/messages" class="font-medium text-blue-deep underline decoration-blue-deep/35 underline-offset-3 hover:decoration-blue-deep">消息参考</a>。
          </p>
        </div>
      </div>
    </div>
  `,
})
export class PlaygroundPage implements OnDestroy {
  private readonly renderer = inject(A2uiRendererService);
  protected readonly actionLog = inject(ActionLogService);

  protected readonly surfaceId = signal<string | null>(null);
  protected readonly angularError = signal<string | null>(null);
  protected readonly showAngular = signal(true);
  protected readonly showReact = signal(true);
  protected readonly processed = signal<Record<string, unknown>[]>([]);
  private readonly resetToken = signal(0);
  // createSurface (step 1) alone has no root component yet; mounting the host
  // before updateComponents (step 2) makes @a2ui/angular log "not found" warnings.
  protected readonly angularReady = computed(() => this.surfaceId() !== null && this.processed().length >= 2);

  private activeSurfaceId: string | null = null;
  private lastToken = -1;
  private lastScenario = '';
  private lastCount = 0;

  protected readonly reactPreviewProps = computed(() => ({
    messages: structuredClone(this.processed()),
    resetKey: this.resetToken(),
    onAction: (action: Record<string, unknown>) => this.actionLog.add(action, 'react'),
  }));

  protected readonly consoleProps = {
    scenarios: SCENARIOS,
    onStream: (state: StreamState) => this.handleStream(state),
    onVisibility: (visibility: {angular: boolean; react: boolean}) => {
      this.showAngular.set(visibility.angular);
      this.showReact.set(visibility.react);
    },
  };

  ngOnDestroy(): void {
    if (this.activeSurfaceId) {
      this.renderer.processMessages([{version: '1.0', deleteSurface: {surfaceId: this.activeSurfaceId}}]);
    }
  }

  protected readonly formatContext = formatContext;

  private handleStream(state: StreamState): void {
    const reset = state.resetToken !== this.lastToken || state.scenarioId !== this.lastScenario;
    if (reset) {
      if (this.activeSurfaceId) {
        this.renderer.processMessages([{version: '1.0', deleteSurface: {surfaceId: this.activeSurfaceId}}]);
      }
      this.lastToken = state.resetToken;
      this.lastScenario = state.scenarioId;
      this.lastCount = 0;
      this.angularError.set(null);
    }
    const delta = state.messages.slice(this.lastCount);
    if (delta.length > 0) {
      try {
        this.renderer.processMessages(structuredClone(delta));
        this.angularError.set(null);
      } catch (err) {
        this.angularError.set(err instanceof Error ? err.message : String(err));
      }
      this.lastCount = state.messages.length;
    }
    const create = state.messages.find(m => 'createSurface' in m) as
      | {createSurface?: {surfaceId?: string}}
      | undefined;
    this.activeSurfaceId = create?.createSurface?.surfaceId ?? null;
    this.surfaceId.set(this.activeSurfaceId);
    this.processed.set(state.messages);
    this.resetToken.set(state.resetToken);
  }
}