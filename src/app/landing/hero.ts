import {AfterViewInit, Component, OnDestroy, computed, effect, inject, signal, viewChild, ElementRef} from '@angular/core';
import {RouterLink} from '@angular/router';
import {A2uiRendererService, SurfaceComponent} from '@a2ui/angular';
import {SCENARIOS, messageType} from '../core/scenarios';
import {RevealDirective} from '../shared/reveal.directive';

const TYPE_COLOR: Record<string, string> = {
  createSurface: 'bg-blue-bright/15 text-blue-glow border-blue-bright/30',
  updateComponents: 'bg-white/8 text-white/85 border-white/20',
  updateDataModel: 'bg-green/15 text-[#7ee2a8] border-green/30',
  deleteSurface: 'bg-red/15 text-[#ff8a80] border-red/30',
};

@Component({
  selector: 'app-hero',
  imports: [RouterLink, SurfaceComponent, RevealDirective],
  templateUrl: './hero.html',
})
export class Hero implements AfterViewInit, OnDestroy {
  private readonly renderer = inject(A2uiRendererService);
  private readonly logBox = viewChild<ElementRef<HTMLElement>>('logBox');

  protected readonly scenario = SCENARIOS[0];
  protected readonly step = signal(0);
  protected readonly playing = signal(true);
  protected readonly copied = signal(false);
  protected readonly installCmd = 'bun add @a2ui/angular @a2ui/web_core';
  protected readonly log = computed(() =>
    this.scenario.messages.slice(0, this.step()).map((m, i) => ({
      index: i + 1,
      type: messageType(m),
      color: TYPE_COLOR[messageType(m)] ?? TYPE_COLOR['updateComponents'],
      json: JSON.stringify(m),
    })),
  );
  protected readonly renderers = [
    {name: 'React', dot: 'bg-blue-bright'},
    {name: 'Angular', dot: 'bg-red'},
    {name: 'Lit', dot: 'bg-blue-glow'},
    {name: 'Flutter', dot: 'bg-blue'},
    {name: 'SwiftUI', dot: 'bg-amber'},
    {name: 'Compose', dot: 'bg-green'},
  ];
  protected readonly stats = [
    {value: '6', label: '官方渲染器', detail: 'React · Angular · Lit · Flutter · SwiftUI · Compose'},
    {value: '3', label: 'Agent SDK 语言', detail: 'TypeScript · Python · Dart'},
    {value: '18', label: '基础目录组件', detail: '排版 · 容器 · 表单 · 导航 · 媒体'},
    {value: '15', label: '标准内置函数', detail: '校验 · 格式化 · 数学 · 逻辑'},
  ];
  protected readonly statValues = signal<number[]>(this.stats.map(() => 0));

  private readonly statsBox = viewChild<ElementRef<HTMLElement>>('statsBox');
  private statsObserver?: IntersectionObserver;
  private countRaf = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private destroyed = false;

  constructor() {
    effect(() => {
      this.step();
      const el = this.logBox()?.nativeElement;
      if (el) requestAnimationFrame(() => (el.scrollTop = el.scrollHeight));
    });
  }

  ngAfterViewInit(): void {
    this.schedule(700);
    const statsEl = this.statsBox()?.nativeElement;
    if (!statsEl) return;
    if (typeof IntersectionObserver === 'undefined') {
      this.statValues.set(this.stats.map(s => Number(s.value)));
      return;
    }
    this.statsObserver = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          this.statsObserver?.disconnect();
          this.startCount();
        }
      },
      {threshold: 0.4},
    );
    this.statsObserver.observe(statsEl);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.timer);
    cancelAnimationFrame(this.countRaf);
    this.statsObserver?.disconnect();
    this.renderer.processMessages([{version: '1.0', deleteSurface: {surfaceId: 'flight-demo'}}]);
  }

  private startCount(): void {
    const targets = this.stats.map(s => Number(s.value));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.statValues.set(targets);
      return;
    }
    const t0 = performance.now();
    const frame = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      this.statValues.set(targets.map(v => Math.round(v * eased)));
      if (p < 1) this.countRaf = requestAnimationFrame(frame);
    };
    this.countRaf = requestAnimationFrame(frame);
  }

  protected togglePlay(): void {
    this.playing.update(v => !v);
    if (this.playing()) this.schedule(300);
    else clearTimeout(this.timer);
  }

  protected replay(): void {
    clearTimeout(this.timer);
    this.renderer.processMessages([{version: '1.0', deleteSurface: {surfaceId: 'flight-demo'}}]);
    this.step.set(0);
    this.playing.set(true);
    this.schedule(400);
  }

  protected async copyInstall(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.installCmd);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  private schedule(delay: number): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.tick(), delay);
  }

  private tick(): void {
    if (this.destroyed || !this.playing()) return;
    const total = this.scenario.messages.length;
    const current = this.step();
    if (current < total) {
      this.renderer.processMessages([structuredClone(this.scenario.messages[current])]);
      this.step.set(current + 1);
      this.schedule(current === 0 ? 600 : 900);
    } else {
      this.timer = setTimeout(() => {
        if (this.destroyed || !this.playing()) return;
        this.renderer.processMessages([{version: '1.0', deleteSurface: {surfaceId: 'flight-demo'}}]);
        this.step.set(0);
        this.schedule(600);
      }, 5000);
    }
  }
}