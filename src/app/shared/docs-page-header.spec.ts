import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {DocsPageHeader} from './docs-page-header';

@Component({
  imports: [DocsPageHeader],
  template: `
    <app-docs-page-header eyebrow="概念 / 目录" heading="目录">
      正文描述,含<a href="/docs/catalogs">站内链接</a>与<strong>强调</strong>。
    </app-docs-page-header>
  `,
})
class HeaderHost {}

describe('DocsPageHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [HeaderHost]}).compileComponents();
  });

  it('renders eyebrow and heading inside a header', async () => {
    const fixture = TestBed.createComponent(HeaderHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const header = el.querySelector('header');

    expect(header).toBeTruthy();
    expect(header?.querySelector('p')?.textContent).toContain('概念 / 目录');
    expect(header?.querySelector('h1')?.textContent).toContain('目录');
    expect(header?.classList.contains('mb-10')).toBe(true);
  });

  it('projects rich inline description content', async () => {
    const fixture = TestBed.createComponent(HeaderHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('header a')?.textContent).toContain('站内链接');
    expect(el.querySelector('header strong')?.textContent).toContain('强调');
    expect(el.querySelector('header p:last-of-type')?.textContent).toContain('正文描述');
  });
});
