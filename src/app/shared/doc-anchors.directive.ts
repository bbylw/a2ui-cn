import {Directive, ElementRef, OnDestroy, inject} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Directive({selector: '[appDocAnchors]'})
export class DocAnchorsDirective implements OnDestroy {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly router = inject(Router);
  private readonly sub = this.router.events.subscribe(e => {
    if (e instanceof NavigationEnd) setTimeout(() => this.decorate());
  });

  constructor() {
    setTimeout(() => this.decorate());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private decorate(): void {
    const headings = this.host.nativeElement.querySelectorAll<HTMLElement>('.doc-prose h2[id], .doc-prose h3[id]');
    for (const heading of headings) {
      if (heading.querySelector('.doc-anchor')) continue;
      const anchor = document.createElement('a');
      anchor.className = 'doc-anchor';
      // base href="/" would resolve a bare fragment against the site root
      anchor.href = this.router.url.split(/[?#]/)[0] + '#' + heading.id;
      anchor.setAttribute('aria-label', '链接到本节:' + (heading.textContent ?? '').trim());
      anchor.textContent = '#';
      anchor.addEventListener('click', e => {
        e.preventDefault();
        void this.router.navigate([], {fragment: heading.id});
      });
      heading.appendChild(anchor);
    }
  }
}