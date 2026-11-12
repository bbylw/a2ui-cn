import {Component, computed, input, signal} from '@angular/core';
import {highlight} from '../core/highlight';

@Component({
  selector: 'app-code',
  template: `
    <div class="code-panel overflow-hidden rounded-xl border border-line-dark shadow-panel">
      <div class="flex items-center justify-between gap-3 border-b border-white/6 bg-ink-900 px-3.5 py-2 sm:py-1.5">
        <span class="flex min-w-0 items-center gap-2">
          <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-glow/60" aria-hidden="true"></span>
          <span class="truncate font-mono text-xs tracking-wide text-ink-faint">{{ label() || lang() }}</span>
        </span>
        <span class="flex shrink-0 items-center gap-2.5">
          @if (lines() > 1) {
            <span class="hidden font-mono text-[11px] tabular-nums text-ink-faint/45 sm:inline">{{ lines() }} 行</span>
          }
          @if (label()) {
            <span class="rounded bg-white/4 px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint/65">{{ lang() }}</span>
          }
          <button
            type="button"
            (click)="copy()"
            class="pressable inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/3 px-2.5 py-1 font-mono text-xs leading-none text-ink-faint transition-colors duration-300 hover:border-blue-bright/60 hover:text-blue-glow"
          >
            @if (copied()) {
              <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 text-[#7ee2a8]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8.5 3.2 3.2L13 5"/></svg>
              <span class="text-[#7ee2a8]">已复制</span>
            } @else {
              <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 opacity-75" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 5.5V3.8A1.3 1.3 0 0 0 9.2 2.5H3.8A1.3 1.3 0 0 0 2.5 3.8v5.4a1.3 1.3 0 0 0 1.3 1.3h1.7"/></svg>
              <span>复制</span>
            }
          </button>
        </span>
      </div>
      <pre class="dark-scroll max-h-128 overflow-auto p-4 text-xs leading-relaxed sm:text-sm"><code [innerHTML]="html()"></code></pre>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly lang = input('json');
  readonly label = input('');
  readonly copied = signal(false);
  protected readonly html = computed(() => highlight(this.code(), this.lang()));
  protected readonly lines = computed(() => this.code().trim().split('\n').length);

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
    } catch {
      const area = document.createElement('textarea');
      area.value = this.code();
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
}