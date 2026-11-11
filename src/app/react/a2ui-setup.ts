import {renderMarkdown} from '@a2ui/markdown-it';
import {injectBasicCatalogStyles, setMarkdownRenderer} from '@a2ui/web_core/v1_0';

let initialized = false;

export function ensureA2uiSetup(): void {
  if (initialized) return;
  initialized = true;
  injectBasicCatalogStyles();
  setMarkdownRenderer(renderMarkdown);
}