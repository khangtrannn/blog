import { Routes } from '@angular/router';

export default <Routes>[
  {
    path: '',
    loadComponent: async () =>
      (await import('./editor.component')).EditorComponent,
    children: [
      {
        path: 'new',
        loadComponent: async () =>
          (await import('./new-post/new-post.component')).NewPostComponent,
      },
      {
        path: ':id/edit',
        loadComponent: async () =>
          (await import('./edit-post/edit-post.component')).EditPostComponent,
      },
      {
        path: '**',
        redirectTo: 'new',
      },
    ],
  },
];
