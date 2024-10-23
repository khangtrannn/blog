import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { PostService } from '../../../core/post.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ContentEditorComponent } from '../content-editor/content-editor.component';
import { Post } from '../../../core/post';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ContentEditorComponent],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPostComponent {
  #postService = inject(PostService);
  #destroyRef = inject(DestroyRef);
  #snackBar = inject(MatSnackBar);

  id = input.required<string>();

  title = signal('');
  content = signal('');

  #post = computed(() => ({
    id: this.id(),
    title: this.title(),
    content: this.content(),
  }));

  #fetchPost = effect(() => {
    const id = this.id();

    untracked(() => {
      this.#postService
        .getById(id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((post) => {
          this.title.set(post.title);
          this.content.set(post.content);
        });
    });
  });

  onSave() {
    this.#snackBar.open('Saving post...');

    try {
      this.#update();
      this.#snackBar.open('Saved post success', '', { duration: 1000 });
    } catch (err) {
      console.error(err);
      this.#snackBar.open('Saved post error', '', { duration: 1000 });
    }
  }

  async #update() {
    await lastValueFrom(this.#postService.update(this.#post()));
  }
}
