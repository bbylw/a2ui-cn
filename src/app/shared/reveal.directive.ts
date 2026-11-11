import {AfterViewInit, Directive, ElementRef, OnDestroy, inject, input} from '@angular/core';

const VARIANTS = ['scale', 'fade', 'mask'];

@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  readonly config = input('', {alias: 'appReveal', transform: (v: number | string) => String(v ?? '')});
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    let delay = 0;
    for (const token of this.config().trim().split(/\s+/)) {
      if (/^\d+$/.test(token)) delay = Number(token);
      else if (VARIANTS.includes(token)) node.classList.add(`reveal-${token}`);
    }
    node.classList.add('reveal');
    node.style.setProperty('--reveal-delay', `${delay}ms`);
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