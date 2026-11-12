import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {DocsPageHeader} from './docs-page-header';

@Component({
  imports: [DocsPageHeader],
  template: `
    <app-docs-page-header eyebrow="概念" heading="目录">
      正文描述,含<a href="/docs/catalogs">站内链接</a>与<strong>强调</strong>。
    </app-docs-page-header>
  `,
})
class HeaderHost {}

describe('DocsPageHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderHost],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the breadcrumb, heading and lede inside a header', async () => {
    const fixture = TestBed.createComponent(HeaderHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const header = el.querySelector('header');

    expect(header).toBeTruthy();
    expect(header?.textContent).toContain('文档');
    expect(header?.textContent).toContain('概念');
    expect(header?.querySelector('nav[aria-label="面包屑"] a')?.getAttribute('href')).toBe('/docs');
    expect(header?.querySelector('h1')?.textContent).toContain('目录');
  });

  it('projects rich inline description content', async () => {
    const fixture = TestBed.createComponent(HeaderHost);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('header a[href="/docs/catalogs"]')?.textContent).toContain('站内链接');
    expect(el.querySelector('header strong')?.textContent).toContain('强调');
    const paragraphs = [...el.querySelectorAll('header p')].map(p => p.textContent ?? '');
    expect(paragraphs.some(text => text.includes('正文描述'))).toBe(true);
  });
});
