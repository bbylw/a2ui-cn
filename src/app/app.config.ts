import {ApplicationConfig, Injector, inject, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {BasicCatalog, provideA2UI, provideMarkdownRenderer} from '@a2ui/angular';
import {renderMarkdown} from '@a2ui/markdown-it';
import {injectBasicCatalogStyles} from '@a2ui/web_core/v1_0';
import {routes} from './app.routes';
import {ActionLogService} from './core/action-log.service';

injectBasicCatalogStyles();

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'top', anchorScrolling: 'enabled'})),
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