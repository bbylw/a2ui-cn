import {ApplicationConfig, Injector, inject, provideBrowserGlobalErrorListeners, provideEnvironmentInitializer} from '@angular/core';
import {ViewportScroller} from '@angular/common';
import {provideRouter, TitleStrategy, withInMemoryScrolling} from '@angular/router';
import {BasicCatalog, provideA2UI, provideMarkdownRenderer} from '@a2ui/angular';
import {renderMarkdown} from '@a2ui/markdown-it';
import {routes} from './app.routes';
import {ActionLogService} from './core/action-log.service';
import {AppTitleStrategy} from './shared/title-strategy';

// Keep this module free of DOM side effects. The Angular renderer is backed by
// web_core/v0_9 (provideA2UI + provideMarkdownRenderer below), while the React
// renderer uses web_core/v1_0 and calls ensureA2uiSetup() lazily when its first
// island mounts. Both markdown renderer registrations are required.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'top', anchorScrolling: 'enabled'})),
    // Anchor targets must land below the fixed 64px header, not under it.
    provideEnvironmentInitializer(() => inject(ViewportScroller).setOffset([0, 88])),
    {provide: TitleStrategy, useClass: AppTitleStrategy},
    provideA2UI(() => {
      const injector = inject(Injector);
      return {
        catalogs: [new BasicCatalog()],
        useUniversalComponents: true,
        actionHandler: action => injector.get(ActionLogService).add(action as Record<string, unknown>, 'angular'),
      };
    }),
    provideMarkdownRenderer(renderMarkdown),
  ],
};