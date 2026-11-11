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
    <section class="bg-paper py-20 lg:py-28" id="protocol">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="max-w-2xl" appReveal>
          <h2 class="text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">协议一瞥</h2>
          <p class="mt-4 text-base leading-relaxed text-ink-soft">
            每条消息都是一个带 <code class="rounded bg-blue-tint px-1.5 py-0.5 font-mono text-[0.85em] text-blue-deep">version</code>
            字段和单一消息键的 JSON 对象。四种核心消息管理界面的整个生命周期,v1.0 新增双向函数调用。
          </p>
        </div>

        <div class="mt-10 grid gap-6 lg:grid-cols-[16rem_1fr]" appReveal="120">
          <div class="flex gap-2 overflow-x-auto lg:flex-col" role="tablist" aria-label="消息类型" (keydown)="onTabKeydown($event)">
            @for (tab of tabs; track tab.key) {
              <button type="button" role="tab" [attr.aria-selected]="active() === tab.key" [attr.tabindex]="active() === tab.key ? 0 : -1" (click)="active.set(tab.key)"
                      class="pressable shrink-0 rounded-xl border px-4 py-3 text-left transition-all lg:shrink"
                      [class]="active() === tab.key
                        ? 'border-blue/40 bg-blue-tint shadow-sm'
                        : 'border-line-warm bg-white hover:border-blue/30 hover:bg-blue-tint/40'">
                <span class="block font-mono text-sm font-semibold" [class.text-blue-deep]="active() === tab.key" [class.text-ink]="active() !== tab.key">{{ tab.title }}</span>
                <span class="mt-0.5 block font-mono text-[10px] text-ink-mute">{{ tab.direction }}</span>
              </button>
            }
          </div>
          <div class="min-w-0">
            @for (tab of [activeTab()]; track tab.key) {
              <div class="animate-rise">
                <p class="mb-4 min-h-12 text-sm leading-relaxed text-ink-soft">{{ tab.description }}</p>
                <app-code [code]="tab.code" lang="json" [label]="tab.title + ' · v1.0'" />
              </div>
            }
          </div>
        </div>

        <p class="mt-8" appReveal="200">
          <a routerLink="/docs/messages" class="text-sm font-semibold text-blue-deep underline decoration-blue-deep/30 underline-offset-4 transition-colors hover:decoration-blue-deep">查看完整消息参考(含双向函数调用)</a>
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
      description: '开辟一块画布(surface)。v1.0 允许在创建时内联初始组件与数据模型,一条消息即可点亮界面。',
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
      description: '以扁平邻接表增改组件:每个组件有唯一 id,child / children 引用其他 id,必须存在 id 为 root 的组件。',
      code: `{
  "version": "1.0",
  "updateComponents": {
    "surfaceId": "flight_search",
    "components": [
      {"id": "root", "component": "Column", "children": ["header", "btn"]},
      {"id": "header", "component": "Text", "text": "可选航班"},
      {"id": "btn_label", "component": "Text", "text": "选择 LH458($680)"},
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
      description: '用 RFC 6901 JSON Pointer 定点更新数据模型,所有绑定该路径的组件原地刷新,无需重发组件定义。',
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
      description: '用户触发交互时回传:上下文中的数据绑定先解析为当前值,再连同时间戳与来源组件一起发送。',
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
  }
}