import { ChangeDetectionStrategy, Component, DestroyRef, effect, HostListener, inject, input, signal, untracked } from '@angular/core';
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
  post = signal<Post>({ id: '', content: '', title: '' });

  #fetchPost = effect(() => {
    const id = this.id();

    untracked(() => {
      this.#postService.getById(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((post) => {
        this.post.set(post);
      })
    })
  });

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.onSave();
    }
  }

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
    console.log(this.post());
    await lastValueFrom(this.#postService.update(this.post()!));
  }
}
