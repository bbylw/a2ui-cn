import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  input,
  viewChild,
} from '@angular/core';
import type {Root} from 'react-dom/client';
import type {ComponentType, createElement as createElementType} from 'react';

type IslandKind = 'surface' | 'playground';

@Component({
  selector: 'app-react-island',
  template: `<div #host class="h-full"></div>`,
})
export class ReactIsland implements AfterViewInit, OnChanges, OnDestroy {
  readonly kind = input.required<IslandKind>();
  readonly islandProps = input<Record<string, unknown>>({});

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private root?: Root;
  private component?: ComponentType<Record<string, unknown>>;
  private createElement?: typeof createElementType;
  private destroyed = false;
  private viewReady = false;
  private mountToken = 0;

  ngAfterViewInit(): void {
    this.viewReady = true;
    void this.mount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // The first ngOnChanges fires before the view (and #host) exists.
    if (!this.viewReady) return;
    if (changes['kind']) {
      // A different kind loads a different component module, so the old React
      // root must be torn down before a new one is created on the same host.
      this.unmount();
      void this.mount();
      return;
    }
    this.render();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.mountToken++;
    const root = this.root;
    this.root = undefined;
    this.component = undefined;
    this.createElement = undefined;
    // Defer teardown so React never unmounts synchronously in the middle of an
    // Angular change detection pass.
    if (root) queueMicrotask(() => root.unmount());
  }

  private async mount(): Promise<void> {
    const token = ++this.mountToken;
    const kind = this.kind();
    const [reactDom, react, mod] = await Promise.all([
      import('react-dom/client'),
      import('react'),
      kind === 'playground' ? import('../react/playground') : import('../react/surface-demo'),
    ]);
    // A newer mount (or destruction) supersedes this async result.
    if (this.destroyed || token !== this.mountToken) return;
    this.createElement = react.createElement;
    this.component = (
      kind === 'playground'
        ? (mod as typeof import('../react/playground')).Playground
        : (mod as typeof import('../react/surface-demo')).SurfaceDemo
    ) as unknown as ComponentType<Record<string, unknown>>;
    this.root = reactDom.createRoot(this.host().nativeElement);
    this.render();
  }

  private render(): void {
    if (!this.root || !this.component || !this.createElement) return;
    this.root.render(this.createElement(this.component, this.islandProps()));
  }

  private unmount(): void {
    this.mountToken++;
    this.root?.unmount();
    this.root = undefined;
    this.component = undefined;
    this.createElement = undefined;
  }
}
