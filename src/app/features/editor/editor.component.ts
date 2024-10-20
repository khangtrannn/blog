import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [MarkdownComponent, FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  postContent = signal('');
  title = signal('Untitled Document');

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
     // Check for Ctrl + S or Command + S
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault(); // Prevent the default save dialog
      this.onSave(); // Call your save function
    }
  }

  onSave() {
    console.log('Saving data...');
  }
}
