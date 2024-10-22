import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarkdownComponent } from 'ngx-markdown';
import { PostService } from '../../core/post.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [MarkdownComponent, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
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
      this.#snackBar.open('Saved post success');
    } catch (err) {
      console.error(err);
      this.#snackBar.open('Saved post error');
    }
  }
}
