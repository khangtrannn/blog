import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { ContentEditorComponent } from '../content-editor/content-editor.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { PostService } from '../../../core/post.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ContentEditorComponent],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPostComponent {
  #snackBar = inject(MatSnackBar);
  #postService = inject(PostService);

  id = signal('');
  title = signal('Untitled Document');
  content = signal('');

  #post = computed(() => ({
    id: this.id(),
    title: this.title(),
    content: this.content(),
  }));

  onSave() {
    this.#snackBar.open('Saving post...');

    try {
      if (this.id()) {
        this.#update();
      } else {
        this.#createNew();
      }

      this.#snackBar.open('Saved post success', '', { duration: 1000 });
    } catch (err) {
      console.error(err);
      this.#snackBar.open('Saved post error', '', { duration: 1000 });
    }
  }

  async #createNew() {
    const response = await lastValueFrom(
      this.#postService.create(this.#post()),
    );
    this.id.set(response.id);
  }

  async #update() {
    await lastValueFrom(this.#postService.update(this.#post()));
  }
}
