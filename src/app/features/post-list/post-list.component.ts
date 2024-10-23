import { Component, inject } from '@angular/core';
import { PostEntryComponent } from './post-entry/post-entry.component';
import { PostService } from '../../core/post.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostEntryComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  #postService = inject(PostService);

  posts = toSignal(this.#postService.getAll());
}
