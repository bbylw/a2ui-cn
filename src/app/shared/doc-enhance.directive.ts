import {Directive, ElementRef, OnDestroy, inject} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

/**
 * Post-render enhancements for docs bodies:
 * - adds a "#" permalink to h2/h3 with an id;
 * - wraps tables in a scroll container so wide tables scroll inside the column
 *   instead of squeezing columns to one character on narrow screens.
 */
@Directive({selector: '[appDocEnhance]'})
export class DocEnhanceDirective implements OnDestroy {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly router = inject(Router);
  private readonly sub = this.router.events.subscribe(e => {
    if (e instanceof NavigationEnd) setTimeout(() => this.decorate());
  });
  private readonly onResize = () => this.syncTableFocus();

  constructor() {
    setTimeout(() => this.decorate());
    window.addEventListener('resize', this.onResize, {passive: true});
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    window.removeEventListener('resize', this.onResize);
  }

  private decorate(): void {
    this.anchorHeadings();
    this.wrapTables();
    this.syncTableFocus();
  }

  private anchorHeadings(): void {
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

  private wrapTables(): void {
    for (const table of this.host.nativeElement.querySelectorAll<HTMLTableElement>('.doc-prose table')) {
      const parent = table.parentElement;
      if (!parent || parent.classList.contains('doc-table-scroll')) continue;
      const scroller = document.createElement('div');
      scroller.className = 'doc-table-scroll';
      parent.insertBefore(scroller, table);
      scroller.appendChild(table);
    }
  }

  /** 溢出的表才可聚焦,避免给短表平白多加 Tab 停靠点 */
  private syncTableFocus(): void {
    for (const scroller of this.host.nativeElement.querySelectorAll<HTMLElement>('.doc-table-scroll')) {
      const overflows = scroller.scrollWidth > scroller.clientWidth + 1;
      if (overflows && scroller.tabIndex !== 0) {
        scroller.tabIndex = 0;
        scroller.setAttribute('role', 'region');
        scroller.setAttribute('aria-label', '可横向滚动的表格');
      } else if (!overflows && scroller.tabIndex === 0) {
        scroller.removeAttribute('tabindex');
        scroller.removeAttribute('role');
        scroller.removeAttribute('aria-label');
      }
    }
  }
}
