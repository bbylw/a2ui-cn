import {Component, input} from '@angular/core';

/**
 * Shared page header for every docs route. The description is projected so pages
 * can keep rich inline content (links, code, emphasis) in their own templates.
 */
@Component({
  selector: 'app-docs-page-header',
  template: `
    <header class="mb-10">
      <p class="font-mono text-xs text-ink-mute">{{ eyebrow() }}</p>
      <h1 class="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{{ heading() }}</h1>
      <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft"><ng-content></ng-content></p>
    </header>
  `,
})
export class DocsPageHeader {
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
}
