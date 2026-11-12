import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="mx-auto flex max-w-3xl flex-col items-start px-4 py-24 sm:px-6">
      <p class="font-mono text-xs tracking-widest text-blue-deep uppercase">404</p>
      <h1 class="mt-4 font-display text-4xl font-bold tracking-tight text-ink">没有找到这个页面</h1>
      <p class="mt-4 max-w-xl leading-relaxed text-ink-soft">
        链接可能已失效,或者文档章节调整过位置。可以从文档首页重新开始,或回到站点概览。
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a
          routerLink="/docs"
          class="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
        >浏览文档</a>
        <a
          routerLink="/"
          class="rounded-lg border border-line-cool bg-card px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-blue/50 hover:text-blue-deep"
        >返回首页</a>
      </div>
    </div>
  `,
})
export class NotFoundPage {}
