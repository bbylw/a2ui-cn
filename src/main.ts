import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err: unknown) => {
  console.error(err);
  // Never leave a blank page when bootstrapping fails (e.g. a broken chunk).
  const host = document.querySelector('app-root');
  if (!host) return;
  host.replaceChildren();
  const notice = document.createElement('div');
  notice.setAttribute('role', 'alert');
  notice.style.cssText =
    'max-width:32rem;margin:4rem auto;padding:1.25rem 1.5rem;border-radius:12px;' +
    'border:1px solid #f2c6c1;background:#fce8e6;color:#c5221f;font:14px/1.7 system-ui,sans-serif';
  notice.textContent = '应用加载失败，请刷新页面重试。';
  host.appendChild(notice);
});
