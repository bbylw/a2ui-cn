import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  protected readonly menuOpen = signal(false);
  protected readonly year = new Date().getFullYear();
  protected readonly scrolled = signal(false);
  protected readonly scrollPct = signal(0);
  protected readonly scrollRatio = computed(() => this.scrollPct() / 100);
  protected readonly supportsScrollTimeline =
    typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline', 'scroll()');

  private readonly router = inject(Router);
  protected readonly currentPath = signal(this.router.url.split(/[?#]/)[0]);
  protected readonly isSpecRoute = computed(() => {
    const p = this.currentPath();
    return p === '/docs/messages' || p.startsWith('/docs/spec-');
  });
  protected readonly isDocsRoute = computed(() => {
    const p = this.currentPath();
    return p.startsWith('/docs') && !this.isSpecRoute();
  });

  private readonly onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    this.scrollPct.set(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    this.scrolled.set(window.scrollY > 8);
  };

  private readonly onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.menuOpen.set(false);
  };

  private readonly routerSub = this.router.events.subscribe(e => {
    if (e instanceof NavigationEnd) {
      this.menuOpen.set(false);
      this.currentPath.set(this.router.url.split(/[?#]/)[0]);
      setTimeout(this.onScroll);
    }
  });

  constructor() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('keydown', this.onKeydown);
    this.onScroll();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('keydown', this.onKeydown);
    this.routerSub.unsubscribe();
  }

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toTop(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }

  protected skipToMain(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }
}