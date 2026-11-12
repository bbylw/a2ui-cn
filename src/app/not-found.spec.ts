import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {NotFoundPage} from './not-found';

describe('NotFoundPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders a 404 heading with recovery links', async () => {
    const fixture = TestBed.createComponent(NotFoundPage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('404');
    expect(el.querySelector('h1')?.textContent).toContain('没有找到这个页面');
    const links = el.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(el.textContent).toContain('浏览文档');
    expect(el.textContent).toContain('返回首页');
  });
});
