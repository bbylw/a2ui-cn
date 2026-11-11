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

  private readonly onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    this.scrollPct.set(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    this.scrolled.set(window.scrollY > 8);
  };

  private readonly routerSub = inject(Router).events.subscribe(e => {
    if (e instanceof NavigationEnd) setTimeout(this.onScroll);
  });

  constructor() {
    window.addEventListener('scroll', this.onScroll, {passive: true});
    this.onScroll();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    this.routerSub.unsubscribe();
  }

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}