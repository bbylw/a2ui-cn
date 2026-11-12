import {Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../shared/code-block';
import {RevealDirective} from '../shared/reveal.directive';

interface MessageTab {
  key: string;
  title: string;
  direction: string;
  description: string;
  code: string;
}

@Component({
  selector: 'app-protocol-peek',
  imports: [CodeBlock, RouterLink, RevealDirective],
  template: `
    <section class="bg-paper py-16 lg:py-24" id="protocol">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="max-w-2xl" appReveal>
          <p class="font-mono text-xs font-semibold uppercase tracking-widest text-blue-deep">消息契约</p>
          <h2 class="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">协议一瞥</h2>
          <p class="mt-4 text-pretty text-base leading-relaxed text-ink-soft">
            每条消息都是一个带 <code class="rounded bg-blue-tint px-1.5 py-0.5 font-mono text-xs font-medium text-blue-deep">version</code>
            字段和单一消息键的 JSON 对象。四种核心消息管理界面的整个生命周期，v1.0 新增双向函数调用。
          </p>
        </div>

        <div class="mt-10 grid gap-6 lg:grid-cols-[16.5rem_1fr]" appReveal="120">
          <div class="lp-hscroll flex gap-2 overflow-x-auto lg:flex-col" role="tablist" aria-label="消息类型" (keydown)="onTabKeydown($event)">
            @for (tab of tabs; track tab.key) {
              <button type="button" role="tab" [id]="'protocol-tab-' + tab.key"
                      [attr.aria-selected]="active() === tab.key"
                      [attr.tabindex]="active() === tab.key ? 0 : -1"
                      (click)="selectTab(tab.key, $event)"
                      class="pressable relative shrink-0 rounded-xl border px-4 py-3 text-left transition-colors duration-300 lg:shrink aria-selected:after:absolute aria-selected:after:inset-x-3 aria-selected:after:bottom-0 aria-selected:after:border-b-2 aria-selected:after:border-blue lg:aria-selected:after:inset-x-auto lg:aria-selected:after:inset-y-2.5 lg:aria-selected:after:left-0 lg:aria-selected:after:border-b-0 lg:aria-selected:after:border-l-3"
                      [class]="active() === tab.key
                        ? 'border-blue/40 bg-blue-tint shadow-2xs'
                        : 'border-line-warm bg-white hover:border-blue/30 hover:bg-blue-tint/35'">
                <span class="block font-mono text-sm font-semibold" [class.text-blue-deep]="active() === tab.key" [class.text-ink]="active() !== tab.key">{{ tab.title }}</span>
                <span class="mt-1 inline-flex items-center gap-1.5 font-mono text-xs"
                      [class.text-amber-deep]="tab.direction.startsWith('renderer')"
                      [class.text-ink-mute]="!tab.direction.startsWith('renderer')">
                  <span class="inline-block size-1.5 rounded-full" [class.bg-amber]="tab.direction.startsWith('renderer')" [class.bg-blue]="!tab.direction.startsWith('renderer')" aria-hidden="true"></span>
                  {{ tab.direction }}
                </span>
              </button>
            }
          </div>
          <div class="min-w-0">
            @for (tab of [activeTab()]; track tab.key) {
              <div role="tabpanel" [attr.aria-labelledby]="'protocol-tab-' + tab.key" class="animate-rise">
                <p class="mb-4 min-h-12 text-pretty text-sm leading-relaxed text-ink-soft">{{ tab.description }}</p>
                <app-code [code]="tab.code" lang="json" [label]="tab.title + ' · v1.0'" />
              </div>
            }
          </div>
        </div>

        <p class="mt-8" appReveal="200">
          <a routerLink="/docs/messages" class="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-deep underline decoration-blue-deep/30 underline-offset-4 transition-colors duration-300 hover:decoration-blue-deep">
            <span>查看完整消息参考（含双向函数调用）</span>
          </a>
        </p>
      </div>
    </section>
  `,
})
export class ProtocolPeek {
  protected readonly active = signal('createSurface');
  protected readonly tabs: MessageTab[] = [
    {
      key: 'createSurface',
      title: 'createSurface',
      direction: 'agent → renderer',
      description: '开辟一块画布（surface）。v1.0 允许在创建时内联初始组件与数据模型，一条消息即可点亮界面。',
      code: `{
  "version": "1.0",
  "createSurface": {
    "surfaceId": "flight_search",
    "catalogId": "https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json",
    "sendDataModel": false
  }
}`,
    },
    {
      key: 'updateComponents',
      title: 'updateComponents',
      direction: 'agent → renderer',
      description: '以扁平邻接表增改组件：每个组件有唯一 id，child / children 引用其他 id，必须存在 id 为 root 的组件。',
      code: `{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "flight_search",
    "components": [
      {"id": "root", "component": "Column", "children": ["header", "btn"]},
      {"id": "header", "component": "Text", "text": "可选航班"},
      {"id": "btn_label", "component": "Text", "text": "选择 LH458 ($680)"},
      {
        "id": "btn",
        "component": "Button",
        "child": "btn_label",
        "variant": "primary",
        "action": {
          "event": {
            "name": "select_flight",
            "context": {"flightId": "LH458", "price": {"@path": "/flights/0/price"}}
          }
        }
      }
    ]
  }
}`,
    },
    {
      key: 'updateDataModel',
      title: 'updateDataModel',
      direction: 'agent → renderer',
      description: '用 RFC 6901 JSON Pointer 定点更新数据模型，所有绑定该路径的组件原地刷新，无需重发组件定义。',
      code: `{
  "version": "1.0",
  "updateDataModel": {
    "surfaceId": "flight_search",
    "path": "/selectedFlight",
    "value": {
      "flightId": "LH458",
      "status": "confirmed",
      "passengers": 2
    }
  }
}`,
    },
    {
      key: 'action',
      title: 'action',
      direction: 'renderer → agent',
      description: '用户触发交互时回传：上下文中的数据绑定先解析为当前值，再连同时间戳与来源组件一起发送。',
      code: `{
  "version": "1.0",
  "action": {
    "name": "select_flight",
    "surfaceId": "flight_search",
    "sourceComponentId": "btn",
    "timestamp": "2026-11-12T10:15:30.000Z",
    "userMessage": "已选择航班 LH458",
    "context": {"flightId": "LH458", "price": 680}
  }
}`,
    },
  ];

  protected activeTab(): MessageTab {
    return this.tabs.find(t => t.key === this.active()) ?? this.tabs[0];
  }

  protected selectTab(key: string, event: Event): void {
    this.active.set(key);
    const btn = event.currentTarget as HTMLElement | null;
    btn?.scrollIntoView?.({block: 'nearest', inline: 'nearest'});
  }

  protected onTabKeydown(event: KeyboardEvent): void {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!forward && !backward && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const current = this.tabs.findIndex(t => t.key === this.active());
    const next = event.key === 'Home' ? 0
      : event.key === 'End' ? this.tabs.length - 1
      : (current + (forward ? 1 : -1) + this.tabs.length) % this.tabs.length;
    this.active.set(this.tabs[next].key);
    const buttons = (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons[next]?.focus();
    buttons[next]?.scrollIntoView?.({block: 'nearest', inline: 'nearest'});
  }
}