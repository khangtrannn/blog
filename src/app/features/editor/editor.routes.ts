import { Routes } from "@angular/router";

export default <Routes>[
  {
    path: 'new',
    loadComponent: async () => (await import('./editor.component')).EditorComponent,
  },
  {
    path: '**',
    redirectTo: 'new'
  }
]