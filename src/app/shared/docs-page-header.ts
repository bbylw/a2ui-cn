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
      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <nav class="flex items-center gap-2 font-mono text-[10.5px] font-medium tracking-[0.14em] text-ink-mute" aria-label="面包屑">
          <span class="inline-block h-1.5 w-1.5 rounded-[1px] bg-blue" aria-hidden="true"></span>
          <a routerLink="/docs" class="transition-colors hover:text-blue-deep">文档</a>
          <span class="text-line-cool" aria-hidden="true">/</span>
          <span class="text-ink-soft">{{ eyebrow() }}</span>
        </nav>
        <p class="flex items-center gap-2 font-mono text-[10.5px] text-ink-mute">
          @if (stats(); as s) {
            <span>{{ s.sections }} 节</span>
            <span class="h-3 w-px bg-line-warm" aria-hidden="true"></span>
            <span>约 {{ s.minutes }} 分钟</span>
          }
        </p>
      </div>
      <h1 class="mt-3 font-display text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.35rem]">{{ heading() }}</h1>
      <p class="mt-4 max-w-[42rem] text-[16.5px] leading-[1.72] text-ink-soft"><ng-content /></p>
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
