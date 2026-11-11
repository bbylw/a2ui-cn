import {Routes} from '@angular/router';

export const routes: Routes = [
  {path: '', loadComponent: () => import('./landing/landing').then(m => m.Landing)},
  {
    path: 'docs',
    loadComponent: () => import('./docs/docs-layout').then(m => m.DocsLayout),
    children: [
      {path: '', loadComponent: () => import('./docs/pages/intro').then(m => m.IntroPage)},
      {path: 'quickstart', loadComponent: () => import('./docs/pages/quickstart').then(m => m.QuickstartPage)},
      {path: 'concepts', loadComponent: () => import('./docs/pages/concepts').then(m => m.ConceptsPage)},
      {path: 'messages', loadComponent: () => import('./docs/pages/messages').then(m => m.MessagesPage)},
      {path: 'renderers', loadComponent: () => import('./docs/pages/renderers').then(m => m.RenderersPage)},
      {path: 'agent-sdk', loadComponent: () => import('./docs/pages/agent-sdk').then(m => m.AgentSdkPage)},
      {path: 'security', loadComponent: () => import('./docs/pages/security').then(m => m.SecurityPage)},
      {path: 'ecosystem', loadComponent: () => import('./docs/pages/ecosystem').then(m => m.EcosystemPage)},
    ],
  },
  {path: 'playground', loadComponent: () => import('./docs/playground-page').then(m => m.PlaygroundPage)},
  {path: '**', redirectTo: ''},
];