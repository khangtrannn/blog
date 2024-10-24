import { Component, inject } from '@angular/core';
import { PostEntryComponent } from './post-entry/post-entry.component';
import { PostService } from '../../core/post.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostEntryComponent, RouterLink, SvgIconComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  #postService = inject(PostService);

  posts = toSignal(this.#postService.getAll());
}
