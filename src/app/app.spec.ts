import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {App} from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // The shell uses RouterLink / RouterOutlet, which require an ActivatedRoute.
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand, skip link and main landmark', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('header')?.textContent).toContain('A2UI');
    expect(el.querySelector('a[href="#main"]')?.textContent).toContain('跳到主要内容');
    expect(el.querySelector('main#main')).toBeTruthy();
  });

  it('should close the mobile menu on Escape', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    // menuOpen is protected; narrow the type locally to exercise the keyboard handler.
    const app = fixture.componentInstance as unknown as {
      menuOpen: {(): boolean; set(value: boolean): void};
    };

    app.menuOpen.set(true);
    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(app.menuOpen()).toBe(false);
  });
});
