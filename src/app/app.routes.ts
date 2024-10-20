import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => (await import('./features/post-list/post-list.component')).PostListComponent,
  },
  {
    path: 'editor',
    loadComponent: async () => ((await import('./features/editor/editor.component')).EditorComponent),
  },
];
