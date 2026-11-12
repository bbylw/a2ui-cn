import {Component, computed, input, signal} from '@angular/core';
import {highlight} from '../core/highlight';

@Component({
  selector: 'app-code',
  template: `
    <div class="code-panel overflow-hidden rounded-[10px] border border-line-dark shadow-panel">
      <div class="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-ink-900 px-3.5 py-2 sm:py-1.5">
        <span class="flex min-w-0 items-center gap-2">
          <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-glow/50" aria-hidden="true"></span>
          <span class="truncate font-mono text-[10.5px] tracking-[0.03em] text-ink-faint">{{ label() || lang() }}</span>
        </span>
        <span class="flex shrink-0 items-center gap-2.5">
          @if (label()) {
            <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint/60">{{ lang() }}</span>
          }
          <button
            type="button"
            (click)="copy()"
            class="pressable min-w-[3.6rem] rounded-md border border-white/10 px-3 py-1.5 font-mono text-[11px] leading-none sm:py-1 text-ink-faint transition-colors hover:border-blue-bright/60 hover:text-blue-glow"
          >
            {{ copied() ? '已复制 ✓' : '复制' }}
          </button>
        </span>
      </div>
      <pre class="dark-scroll max-h-[32rem] overflow-auto p-4 text-[12.5px] leading-[1.75]"><code [innerHTML]="html()"></code></pre>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly lang = input('json');
  readonly label = input('');
  readonly copied = signal(false);
  protected readonly html = computed(() => highlight(this.code(), this.lang()));

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