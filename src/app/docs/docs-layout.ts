import {Component, ElementRef, OnDestroy, computed, inject, signal, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {filter, map} from 'rxjs';
import {DocEnhanceDirective} from '../shared/doc-enhance.directive';

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
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DocEnhanceDirective],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <!-- 窄屏:分组目录抽屉,替代 36 个横向 chip -->
      <nav class="mb-6 lg:hidden" aria-label="文档导航">
        <button
          type="button"
          (click)="menuOpen.set(!menuOpen())"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="doc-menu"
          class="flex w-full items-center gap-3 rounded-xl border border-line-cool bg-card px-3.5 py-2.5 text-left shadow-lift transition-colors hover:border-blue/40"
        >
          <span class="h-6 w-0.5 shrink-0 rounded-full bg-blue" aria-hidden="true"></span>
          <span class="min-w-0 flex-1">
            <span class="block font-mono text-[10px] tracking-[0.14em] text-ink-mute">文档目录 · {{ current().group }}</span>
            <span class="mt-0.5 block truncate font-display text-[14px] font-bold text-ink">{{ current().label }}</span>
          </span>
          <span class="shrink-0 font-mono text-[10px] text-ink-mute">{{ flat.length }} 篇</span>
          <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-ink-mute transition-transform duration-200" [class.rotate-180]="menuOpen()" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        @if (menuOpen()) {
          <div id="doc-menu" class="doc-menu quiet-scroll mt-2 max-h-[64vh] overflow-y-auto rounded-xl border border-line-cool bg-card p-3.5 shadow-lift">
            @if (toc().length > 1) {
              <details class="group mb-3 overflow-hidden rounded-lg border border-line-warm bg-paper/60">
                <summary class="flex cursor-pointer list-none items-center justify-between gap-2 px-2.5 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-mute [&::-webkit-details-marker]:hidden">
                  <span>本页目录</span>
                  <span class="flex items-center gap-2">
                    <span class="text-ink-faint">{{ toc().length }}</span>
                    <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                </summary>
                <ul class="border-t border-line-warm px-1.5 pt-1 pb-1.5">
                  @for (item of toc(); track item.id) {
                    <li>
                      <a
                        [href]="tocHref(item.id)"
                        (click)="jumpFromMenu($event, item.id)"
                        class="doc-menu-link"
                        [class.is-active]="activeId() === item.id"
                      >{{ item.text }}</a>
                    </li>
                  }
                </ul>
              </details>
            }
            @for (group of nav; track group.title) {
              <div class="mb-3.5 last:mb-0">
                <p class="mb-1 flex items-baseline gap-2 px-1 font-mono text-[10.5px] font-semibold tracking-[0.13em] text-ink-mute">
                  {{ group.title }}
                  <span class="text-ink-faint/70">{{ group.links.length }}</span>
                </p>
                <ul class="grid grid-cols-2 gap-x-1">
                  @for (link of group.links; track link.path) {
                    <li>
                      <a
                        [routerLink]="link.path"
                        routerLinkActive="is-active"
                        ariaCurrentWhenActive="page"
                        [routerLinkActiveOptions]="{exact: link.path === '/docs'}"
                        (click)="menuOpen.set(false)"
                        class="doc-menu-link"
                      >{{ link.label }}</a>
                    </li>
                  }
                </ul>
              </div>
            }
            <a
              routerLink="/playground"
              (click)="menuOpen.set(false)"
              class="mt-1 flex items-center justify-between rounded-lg bg-ink-900 px-3 py-2.5 text-[13px] font-medium text-white"
            >
              <span>Playground</span>
              <span class="font-mono text-[10px] font-normal text-white/50">双渲染器</span>
            </a>
          </div>
        }
      </nav>

      <div class="grid gap-10 lg:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)_196px] xl:gap-10">
        <aside class="hidden lg:block">
          <div class="sticky top-24">
            <div class="flex items-baseline justify-between border-b border-line-warm pb-2.5">
              <span class="font-mono text-[10.5px] font-semibold tracking-[0.14em] text-ink-mute">文档</span>
              <span class="font-mono text-[10px] text-ink-mute">{{ flat.length }} 篇</span>
            </div>
            <div #sideNav class="quiet-scroll scroll-fade-y mt-3.5 max-h-[calc(100vh-9.5rem)] overflow-y-auto pt-2 pr-2 pb-4">
              @for (group of nav; track group.title) {
                <p class="mt-6 mb-1.5 font-mono text-[10.5px] font-semibold tracking-[0.13em] text-ink-mute first:mt-0">
                  {{ group.title }}
                </p>
                <ul class="doc-nav-group">
                  @for (link of group.links; track link.path) {
                    <li>
                      <a
                        [routerLink]="link.path"
                        routerLinkActive="is-active"
                        ariaCurrentWhenActive="page"
                        [routerLinkActiveOptions]="{exact: link.path === '/docs'}"
                        class="doc-nav-link"
                      >{{ link.label }}</a>
                    </li>
                  }
                </ul>
              }
              <a
                routerLink="/playground"
                class="mt-7 block rounded-lg border border-ink-900 bg-ink-900 p-3.5 text-white shadow-lift transition-transform hover:-translate-y-0.5"
              >
                <span class="flex items-center gap-2 font-display text-[13.5px] font-bold">
                  <span class="inline-block h-1.5 w-1.5 rounded-full bg-green animate-live"></span>
                  Playground
                </span>
                <span class="mt-1 block text-[11.5px] leading-relaxed text-white/55">逐条播放协议消息,同时驱动 Angular 与 React。</span>
              </a>
            </div>
          </div>
        </aside>

        <div #contentHost class="min-w-0" appDocEnhance>
          <router-outlet />

          <nav class="mt-12 grid gap-3 border-t border-line-warm pt-6 sm:grid-cols-2" aria-label="上一节 / 下一节">
            @if (prev(); as p) {
              <a [routerLink]="p.path" class="doc-pager group">
                <span class="font-mono text-[10px] tracking-[0.12em] text-ink-mute">上一节</span>
                <span class="mt-1 block font-display text-[14.5px] font-bold leading-snug text-ink transition-colors group-hover:text-blue-deep">{{ p.label }}</span>
              </a>
            } @else {
              <span class="hidden sm:block"></span>
            }
            @if (next(); as n) {
              <a [routerLink]="n.path" class="doc-pager group sm:text-right">
                <span class="font-mono text-[10px] tracking-[0.12em] text-ink-mute">下一节</span>
                <span class="mt-1 block font-display text-[14.5px] font-bold leading-snug text-ink transition-colors group-hover:text-blue-deep">{{ n.label }}</span>
              </a>
            }
          </nav>
        </div>

        <aside class="hidden xl:block">
          @if (toc().length > 1) {
            <div class="sticky top-24">
              <div class="flex items-baseline justify-between border-b border-line-warm pb-2.5">
                <span class="font-mono text-[10.5px] font-semibold tracking-[0.14em] text-ink-mute">本页目录</span>
                <span class="font-mono text-[10px] text-ink-mute">{{ toc().length }}</span>
              </div>
              <nav class="quiet-scroll max-h-[calc(100vh-12rem)] overflow-y-auto pt-3" aria-label="本页目录">
                <ul class="doc-toc-group">
                  @for (item of toc(); track item.id) {
                    <li>
                      <a
                        [href]="tocHref(item.id)"
                        (click)="jump($event, item.id)"
                        [attr.aria-current]="activeId() === item.id ? 'location' : null"
                        class="doc-toc-link"
                        [class.is-active]="activeId() === item.id"
                      >{{ item.text }}</a>
                    </li>
                  }
                </ul>
              </nav>
              <button
                type="button"
                (click)="toTop()"
                class="-ml-1 mt-3 rounded px-1 py-1 font-mono text-[10.5px] text-ink-faint transition-colors hover:text-blue-deep"
              >回到顶部</button>
            </div>
          }
        </aside>
      </div>
    </div>
  `,
  styles: `
    .doc-pager {
      display: block;
      border: 1px solid var(--color-line-cool);
      border-radius: 10px;
      background: var(--color-card);
      padding: 0.7rem 0.95rem 0.8rem;
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    }
    .doc-pager:hover {
      border-color: rgb(26 115 232 / 0.45);
      box-shadow: var(--shadow-lift);
      transform: translateY(-1px);
    }
  `,
})
export class DocsLayout implements OnDestroy {
  private readonly router = inject(Router);
  protected readonly nav = NAV;
  protected readonly flat = FLAT;
  protected readonly menuOpen = signal(false);

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

  /** 窄屏抽屉顶部的当前位置,取自路由而非 DOM,避免首帧空白 */
  protected readonly current = computed(() => {
    const path = this.url().split(/[?#]/)[0];
    for (const group of NAV) {
      const link = group.links.find(item => item.path === path);
      if (link) return {group: group.title, label: link.label};
    }
    return {group: '文档', label: '文档'};
  });

  protected tocHref(id: string): string {
    return this.router.url.split(/[?#]/)[0] + '#' + id;
  }

  protected jump(event: Event, id: string): void {
    event.preventDefault();
    this.activeId.set(id);
    void this.router.navigate([], {fragment: id});
  }

  /** 窄屏抽屉里点“本页目录”:先收起抽屉,再跳到锚点 */
  protected jumpFromMenu(event: Event, id: string): void {
    this.menuOpen.set(false);
    this.jump(event, id);
  }

  protected toTop(): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
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
    const host = this.sideNav()?.nativeElement;
    const link = host?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!host || !link) return;
    const view = host.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    // 已在可视范围内就不动,避免每次进页面目录都无谓跳动;越界时居中,保留同组上下文。
    if (box.top >= view.top && box.bottom <= view.bottom) return;
    host.scrollTop += box.top - view.top - (host.clientHeight - link.offsetHeight) / 2;
  }
}
