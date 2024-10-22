import { Component, HostListener, inject, signal } from '@angular/core';
import { ContentEditorComponent } from '../content-editor/content-editor.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { PostService } from '../../../core/post.service';
import { Post } from '../../../core/post';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ContentEditorComponent],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {
  post = signal<Post>({ id: '', title: 'Untitled Document', content: '', });
  #snackBar = inject(MatSnackBar);
  #postService = inject(PostService);

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
      if (this.post().id) {
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
    const response = await lastValueFrom(this.#postService.create(this.post()));
    this.post.update((post) => ({ ...post, id: response.id }));
  }

  async #update() {
    await lastValueFrom(this.#postService.update(this.post()));
  }
}
