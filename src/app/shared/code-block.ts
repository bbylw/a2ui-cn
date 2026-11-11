import {Component, computed, input, signal} from '@angular/core';
import {highlight} from '../core/highlight';

@Component({
  selector: 'app-code',
  template: `
    <div class="code-panel overflow-hidden rounded-xl border border-line-dark shadow-panel">
      <div class="flex items-center justify-between gap-3 border-b border-line-dark bg-ink-900 px-4 py-2">
        <span class="truncate font-mono text-[11px] tracking-wide text-ink-faint">{{ label() || lang() }}</span>
        <button
          type="button"
          (click)="copy()"
          class="shrink-0 rounded-md border border-line-dark px-2.5 py-1 font-mono text-[11px] text-ink-faint transition-colors hover:border-blue-bright hover:text-blue-glow"
        >
          {{ copied() ? '已复制 ✓' : '复制' }}
        </button>
      </div>
      <pre class="dark-scroll max-h-[32rem] overflow-auto p-4 text-[13px] leading-relaxed"><code [innerHTML]="html()"></code></pre>
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