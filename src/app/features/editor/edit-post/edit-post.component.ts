import { Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';
import { PostService } from '../../../core/post.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ContentEditorComponent } from '../content-editor/content-editor.component';
import { Post } from '../../../core/post';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ContentEditorComponent],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent {
  #postService = inject(PostService);
  #destroyRef = inject(DestroyRef);

  id = input.required<string>();
  post = signal<Post | undefined>(undefined);

  #fetchPost = effect(() => {
    const id = this.id();

    untracked(() => {
      this.#postService.getById(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((post) => {
        this.post.set(post);
      })
    })
  });
}
