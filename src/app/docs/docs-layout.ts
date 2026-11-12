import {Component, ElementRef, OnDestroy, computed, inject, signal, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {filter, map} from 'rxjs';
import {DocAnchorsDirective} from '../shared/doc-anchors.directive';

interface DocLink {
  path: string;
  label: string;
}

interface DocGroup {
  title: string;
  links: DocLink[];
}

const NAV: DocGroup[] = [
  {
    title: '入门',
    links: [
      {path: '/docs', label: '简介'},
      {path: '/docs/quickstart', label: '快速开始'},
      {path: '/docs/walkthrough', label: '分步详解'},
    ],
  },
  {
    title: '概念',
    links: [
      {path: '/docs/concepts', label: '核心概念'},
      {path: '/docs/messages', label: '消息参考'},
      {path: '/docs/catalogs', label: '目录'},
      {path: '/docs/data-binding', label: '数据模型与绑定'},
      {path: '/docs/actions', label: '动作、事件与函数'},
      {path: '/docs/inference', label: '推理格式'},
      {path: '/docs/sdks', label: 'SDK 一览'},
      {path: '/docs/glossary', label: '术语表'},
      {path: '/docs/security', label: '安全模型'},
    ],
  },
  {
    title: '指南',
    links: [
      {path: '/docs/renderers', label: '客户端集成'},
      {path: '/docs/agent-sdk', label: 'Agent 集成'},
      {path: '/docs/define-catalog', label: '定义目录'},
      {path: '/docs/macros', label: '使用宏'},
      {path: '/docs/mcp', label: 'MCP 总览'},
      {path: '/docs/mcp-tools', label: '调用 MCP 工具'},
      {path: '/docs/mcp-layouts', label: '提供 A2UI 布局'},
      {path: '/docs/mcp-apps', label: '嵌入 MCP Apps'},
      {path: '/docs/mcp-render', label: '在 MCP App 中渲染'},
      {path: '/docs/universal', label: '通用 Web 组件'},
    ],
  },
  {
    title: '生态',
    links: [
      {path: '/docs/built-with', label: 'Built with A2UI'},
      {path: '/docs/roadmap', label: '路线图'},
      {path: '/docs/ecosystem', label: '社区项目'},
      {path: '/docs/get-help', label: '获取帮助'},
    ],
  },
  {
    title: '规范 v1.0',
    links: [
      {path: '/docs/spec-v1-protocol', label: '协议规范'},
      {path: '/docs/spec-v1-schemas', label: 'JSON Schema'},
      {path: '/docs/spec-v1-catalog', label: '基础目录指南'},
      {path: '/docs/spec-v1-a2a', label: 'A2A 扩展'},
      {path: '/docs/spec-v1-evolution', label: '演进指南'},
    ],
  },
  {
    title: '规范 v0.9.1',
    links: [
      {path: '/docs/spec-v091-protocol', label: '协议规范'},
      {path: '/docs/spec-v091-schemas', label: 'JSON Schema'},
      {path: '/docs/spec-v091-catalog', label: '基础目录指南'},
      {path: '/docs/spec-v091-a2a', label: 'A2A 扩展'},
      {path: '/docs/spec-v091-evolution', label: '演进指南'},
    ],
  },
];

const FLAT: DocLink[] = NAV.flatMap(group => group.links);

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DocAnchorsDirective],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav class="mb-8 lg:hidden" aria-label="文档导航">
        <div #chipRow class="chip-row -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          @for (link of flat; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="border-blue bg-blue-tint text-blue-deep" ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="{exact: link.path === '/docs'}"
              class="shrink-0 rounded-full border border-line-cool bg-card px-3.5 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-blue/50 hover:text-blue-deep"
            >{{ link.label }}</a>
          }
          <a
            routerLink="/playground"
            class="shrink-0 rounded-full border border-ink-900 bg-ink-900 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-ink-700"
          >Playground</a>
        </div>
      </nav>

      <div class="grid gap-10 lg:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)_192px] xl:gap-10">
        <aside class="hidden lg:block">
          <div #sideNav class="quiet-scroll sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-2 pb-4">
            @for (group of nav; track group.title) {
              <p class="mt-7 mb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-mute uppercase first:mt-0">{{ group.title }}</p>
              <ul class="space-y-0.5 border-l border-line-warm">
                @for (link of group.links; track link.path) {
                  <li>
                    <a
                      [routerLink]="link.path"
                      routerLinkActive="border-blue bg-blue-tint/70 font-semibold text-blue-deep" ariaCurrentWhenActive="page"
                      [routerLinkActiveOptions]="{exact: link.path === '/docs'}"
                      class="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[13.5px] text-ink-soft transition-colors hover:border-blue/40 hover:text-ink"
                    >{{ link.label }}</a>
                  </li>
                }
              </ul>
            }
            <a
              routerLink="/playground"
              class="mt-8 block rounded-xl border border-ink-900 bg-ink-900 p-4 text-white shadow-lift transition-transform hover:-translate-y-0.5"
            >
              <span class="flex items-center gap-2 font-display text-sm font-bold">
                <span class="inline-block h-2 w-2 rounded-full bg-green animate-live"></span>
                Playground
              </span>
              <span class="mt-1.5 block text-xs leading-relaxed text-white/60">逐条播放协议消息,同时驱动 Angular 与 React 渲染器。</span>
            </a>
          </div>
        </aside>

        <div #contentHost class="min-w-0" appDocAnchors>
          <router-outlet />

          <nav class="mt-14 grid gap-6 border-t border-line-warm pt-8 sm:grid-cols-2" aria-label="上一节 / 下一节">
            @if (prev(); as p) {
              <a [routerLink]="p.path" class="group block">
                <span class="font-mono text-[11px] tracking-wide text-ink-mute">上一节</span>
                <span class="mt-1 block font-display text-[15px] font-bold text-ink underline decoration-line-cool decoration-2 underline-offset-4 transition-colors group-hover:text-blue-deep group-hover:decoration-blue/50">{{ p.label }}</span>
              </a>
            } @else {
              <span class="hidden sm:block"></span>
            }
            @if (next(); as n) {
              <a [routerLink]="n.path" class="group block sm:col-start-2 sm:text-right">
                <span class="font-mono text-[11px] tracking-wide text-ink-mute">下一节</span>
                <span class="mt-1 block font-display text-[15px] font-bold text-ink underline decoration-line-cool decoration-2 underline-offset-4 transition-colors group-hover:text-blue-deep group-hover:decoration-blue/50">{{ n.label }}</span>
              </a>
            }
          </nav>
        </div>

        <aside class="hidden xl:block">
          @if (toc().length > 1) {
            <nav class="quiet-scroll sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto pb-4" aria-label="本页目录">
              <p class="mb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-mute uppercase">本页目录</p>
              <ul class="space-y-0.5 border-l border-line-warm">
                @for (item of toc(); track item.id) {
                  <li>
                    <a
                      [href]="tocHref(item.id)"
                      (click)="jump($event, item.id)"
                      [attr.aria-current]="activeId() === item.id ? 'location' : null"
                      [class]="tocClass(item.id)"
                    >{{ item.text }}</a>
                  </li>
                }
              </ul>
            </nav>
          }
        </aside>
      </div>
    </div>
  `,
})
export class DocsLayout implements OnDestroy {
  private readonly router = inject(Router);
  protected readonly nav = NAV;
  protected readonly flat = FLAT;

  private readonly chipRow = viewChild<ElementRef<HTMLElement>>('chipRow');
  private readonly sideNav = viewChild<ElementRef<HTMLElement>>('sideNav');
  private readonly contentHost = viewChild<ElementRef<HTMLElement>>('contentHost');

  protected readonly toc = signal<{id: string; text: string}[]>([]);
  protected readonly activeId = signal('');

  private lastPath = '';
  private ticking = false;
  private readonly onScroll = () => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      this.spy();
    });
  };
  private readonly sub = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => setTimeout(() => this.afterNav()));

  constructor() {
    window.addEventListener('scroll', this.onScroll, {passive: true});
    setTimeout(() => this.afterNav());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    window.removeEventListener('scroll', this.onScroll);
  }

  private readonly url = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    {initialValue: this.router.url},
  );

  private readonly index = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    return FLAT.findIndex(link => link.path === path);
  });
  protected readonly prev = computed(() => (this.index() > 0 ? FLAT[this.index() - 1] : null));
  protected readonly next = computed(() =>
    this.index() >= 0 && this.index() < FLAT.length - 1 ? FLAT[this.index() + 1] : null,
  );

  protected tocClass(id: string): string {
    const base = '-ml-px block border-l-2 py-1 pl-3.5 text-[12.5px] leading-snug transition-colors';
    return this.activeId() === id
      ? base + ' border-blue font-semibold text-blue-deep'
      : base + ' border-transparent text-ink-mute hover:border-blue/40 hover:text-ink';
  }

  protected tocHref(id: string): string {
    return this.router.url.split(/[?#]/)[0] + '#' + id;
  }

  protected jump(event: Event, id: string): void {
    event.preventDefault();
    this.activeId.set(id);
    void this.router.navigate([], {fragment: id});
  }

  private afterNav(): void {
    const path = this.router.url.split(/[?#]/)[0];
    const changed = path !== this.lastPath;
    this.lastPath = path;
    this.collectToc();
    this.spy();
    this.revealActive();
    if (changed) {
      const host = this.contentHost()?.nativeElement;
      if (host) {
        host.classList.remove('doc-enter');
        void host.offsetWidth;
        host.classList.add('doc-enter');
      }
    }
  }

  private collectToc(): void {
    const host = this.contentHost()?.nativeElement;
    if (!host) return;
    const items = [...host.querySelectorAll<HTMLElement>('.doc-prose h2[id]')].map(heading => {
      const clone = heading.cloneNode(true) as HTMLElement;
      clone.querySelector('.doc-anchor')?.remove();
      return {id: heading.id, text: (clone.textContent ?? '').trim()};
    });
    this.toc.set(items);
  }

  private spy(): void {
    const items = this.toc();
    const host = this.contentHost()?.nativeElement;
    if (!items.length || !host) return;
    let current = items[0].id;
    for (const item of items) {
      const el = host.querySelector<HTMLElement>('#' + CSS.escape(item.id));
      if (el && el.getBoundingClientRect().top <= 96) current = item.id;
      else break;
    }
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = items[items.length - 1].id;
    }
    this.activeId.set(current);
  }

  private revealActive(): void {
    const active = 'a[aria-current="page"]';
    this.chipRow()?.nativeElement
      .querySelector(active)
      ?.scrollIntoView({behavior: 'instant', block: 'nearest', inline: 'center'});
    this.sideNav()?.nativeElement
      .querySelector(active)
      ?.scrollIntoView({behavior: 'instant', block: 'nearest'});
  }
}