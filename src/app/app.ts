import {Component, OnDestroy, inject, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly scrollPct = signal(0);

  private readonly router = inject(Router);

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
      setTimeout(this.onScroll);
    }
  });

  constructor() {
    window.addEventListener('scroll', this.onScroll, {passive: true});
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

  protected skipToMain(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }
}