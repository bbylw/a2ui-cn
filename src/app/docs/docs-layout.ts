import {Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {filter, map} from 'rxjs';

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
    ],
  },
  {
    title: '理解 A2UI',
    links: [
      {path: '/docs/concepts', label: '核心概念'},
      {path: '/docs/messages', label: '消息参考'},
      {path: '/docs/security', label: '安全模型'},
    ],
  },
  {
    title: '构建',
    links: [
      {path: '/docs/renderers', label: '渲染器'},
      {path: '/docs/agent-sdk', label: 'Agent SDK'},
      {path: '/docs/ecosystem', label: '生态与路线图'},
    ],
  },
];

const FLAT: DocLink[] = NAV.flatMap(group => group.links);

@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav class="mb-8 lg:hidden" aria-label="文档导航">
        <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          @for (link of flat; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="border-blue bg-blue-tint text-blue-deep"
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

      <div class="grid gap-10 lg:grid-cols-[232px_minmax(0,1fr)] xl:gap-14">
        <aside class="hidden lg:block">
          <div class="sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-2 pb-4">
            @for (group of nav; track group.title) {
              <p class="mt-7 mb-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-ink-faint uppercase first:mt-0">{{ group.title }}</p>
              <ul class="space-y-0.5 border-l border-line-warm">
                @for (link of group.links; track link.path) {
                  <li>
                    <a
                      [routerLink]="link.path"
                      routerLinkActive="border-blue bg-blue-tint/70 font-semibold text-blue-deep"
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

        <div class="min-w-0">
          <router-outlet />

          <nav class="mt-14 grid gap-3 border-t border-line-warm pt-8 sm:grid-cols-2" aria-label="上一节 / 下一节">
            @if (prev(); as p) {
              <a [routerLink]="p.path" class="group rounded-xl border border-line-cool bg-card p-4 shadow-lift transition-colors hover:border-blue/50">
                <span class="font-mono text-[11px] tracking-wide text-ink-faint">上一节</span>
                <span class="mt-1 block font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">{{ p.label }}</span>
              </a>
            } @else {
              <span class="hidden sm:block"></span>
            }
            @if (next(); as n) {
              <a [routerLink]="n.path" class="group rounded-xl border border-line-cool bg-card p-4 text-right shadow-lift transition-colors hover:border-blue/50 sm:col-start-2">
                <span class="font-mono text-[11px] tracking-wide text-ink-faint">下一节</span>
                <span class="mt-1 block font-display text-[15px] font-bold text-ink group-hover:text-blue-deep">{{ n.label }}</span>
              </a>
            }
          </nav>
        </div>
      </div>
    </div>
  `,
})
export class DocsLayout {
  private readonly router = inject(Router);
  protected readonly nav = NAV;
  protected readonly flat = FLAT;

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
}