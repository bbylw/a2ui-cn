import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', loadComponent: () => import('./landing/landing').then(m => m.Landing)},
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs-layout').then(m => m.DocsLayout),
    children: [
      {path: '', title: '简介', loadComponent: () => import('./docs/pages/intro').then(m => m.IntroPage)},
      {path: 'quickstart', title: '快速开始', loadComponent: () => import('./docs/pages/quickstart').then(m => m.QuickstartPage)},
      {path: 'concepts', title: '核心概念', loadComponent: () => import('./docs/pages/concepts').then(m => m.ConceptsPage)},
      {path: 'messages', title: '消息参考', loadComponent: () => import('./docs/pages/messages').then(m => m.MessagesPage)},
      {path: 'renderers', title: '渲染器', loadComponent: () => import('./docs/pages/renderers').then(m => m.RenderersPage)},
      {path: 'agent-sdk', title: 'Agent SDK', loadComponent: () => import('./docs/pages/agent-sdk').then(m => m.AgentSdkPage)},
      {path: 'security', title: '安全模型', loadComponent: () => import('./docs/pages/security').then(m => m.SecurityPage)},
      {path: 'ecosystem', title: '生态与路线图', loadComponent: () => import('./docs/pages/ecosystem').then(m => m.EcosystemPage)},
    ],
  },
  {path: 'playground', title: 'Playground', loadComponent: () => import('./docs/playground-page').then(m => m.PlaygroundPage)},
  {path: '**', redirectTo: ''},
];