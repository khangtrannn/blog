import { Component, HostListener, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { PostService } from '../../../core/post.service';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [MarkdownComponent, FormsModule],
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.scss'
})
export class ContentEditorComponent {
  title = signal('Untitled Document');
  content = signal('');

  #snackBar = inject(MatSnackBar);
  #postService = inject(PostService);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.onSave();
    }
  }

  async onSave() {
    this.#snackBar.open('Saving post...');
    try {
      await lastValueFrom(this.#postService.create(this.title(), this.content()));
      this.#snackBar.open('Saved post success', '', { duration: 1000 });
    } catch (err) {
      console.error(err);
      this.#snackBar.open('Saved post error', '', { duration: 1000 });
    }
  }
}
