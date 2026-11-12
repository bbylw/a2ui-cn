import {Component, ElementRef, afterNextRender, inject, input, signal} from '@angular/core';
import {RouterLink} from '@angular/router';

/**
 * Shared page header for every docs route. The description is projected so pages
 * can keep rich inline content (links, code, emphasis) in their own templates.
 *
 * The section count and reading estimate are measured from the sibling
 * `.doc-prose` block after the first render, so they stay accurate without
 * hand-maintained metadata on 36 pages.
 */
@Component({
  selector: 'app-docs-page-header',
  imports: [RouterLink],
  template: `
    <header class="mb-8 border-b border-line-warm pb-7">
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <nav class="flex items-center gap-2 font-mono text-xs font-medium tracking-wider text-ink-mute" aria-label="面包屑">
          <a routerLink="/docs" class="transition-colors duration-300 hover:text-blue-deep">文档</a>
          <span class="text-line-cool" aria-hidden="true">/</span>
          <span class="rounded-md border border-blue/20 bg-blue-tint px-2 py-0.5 font-semibold text-blue-deep">{{ eyebrow() }}</span>
        </nav>
        @if (stats(); as s) {
          <p class="inline-flex items-center gap-2 rounded-md border border-line-warm bg-paper/75 px-2.5 py-1 font-mono text-xs tabular-nums text-ink-mute">
            <span>{{ s.sections }} 节</span>
            <span class="h-3 w-px bg-line-cool" aria-hidden="true"></span>
            <span>约 {{ s.minutes }} 分钟</span>
          </p>
        }
      </div>
      <h1 class="mt-3.5 text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{{ heading() }}</h1>
      <p class="mt-3.5 max-w-2xl text-pretty text-base leading-relaxed text-ink-soft"><ng-content /></p>
    </header>
  `,
})
export class DocsPageHeader {
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly stats = signal<{sections: number; minutes: number} | null>(null);

  constructor() {
    afterNextRender(() => {
      const prose = this.host.nativeElement.parentElement?.querySelector('.doc-prose');
      if (!prose) return;
      const sections = prose.querySelectorAll('h2[id]').length;
      if (!sections) return;
      const chars = (prose.textContent ?? '').replace(/\s+/g, '').length;
      // 中文技术文档按 400 字/分钟估算,四舍五入到整分钟,最少 1 分钟。
      this.stats.set({sections, minutes: Math.max(1, Math.round(chars / 400))});
    });
  }
}
