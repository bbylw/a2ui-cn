import {AfterViewInit, Directive, ElementRef, OnDestroy, inject, input} from '@angular/core';

@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly delay = input(0, {alias: 'appReveal', transform: (v: number | string) => Number(v) || 0});
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal');
    node.style.setProperty('--reveal-delay', `${this.delay()}ms`);
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.unobserve(node);
          }
        }
      },
      {threshold: 0.12, rootMargin: '0px 0px -8% 0px'},
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}