import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  input,
  viewChild,
} from '@angular/core';
import type {Root} from 'react-dom/client';
import type {ComponentType, createElement as createElementType} from 'react';

@Component({
  selector: 'app-react-island',
  template: `<div #host class="h-full"></div>`,
})
export class ReactIsland implements AfterViewInit, OnChanges, OnDestroy {
  readonly kind = input.required<'surface' | 'playground'>();
  readonly islandProps = input<Record<string, unknown>>({}, {alias: 'islandProps'});

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private root?: Root;
  private component?: ComponentType<Record<string, unknown>>;
  private createElement?: typeof createElementType;
  private destroyed = false;

  ngAfterViewInit(): void {
    void this.mount();
  }

  ngOnChanges(): void {
    this.render();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.root?.unmount();
    this.root = undefined;
  }

  private async mount(): Promise<void> {
    const [reactDom, react, mod] = await Promise.all([
      import('react-dom/client'),
      import('react'),
      this.kind() === 'playground' ? import('../react/playground') : import('../react/surface-demo'),
    ]);
    if (this.destroyed) return;
    this.createElement = react.createElement;
    this.component = (
      this.kind() === 'playground'
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
}