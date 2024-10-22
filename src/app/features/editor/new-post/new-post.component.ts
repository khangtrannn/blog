import { Component } from '@angular/core';
import { ContentEditorComponent } from '../content-editor/content-editor.component';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ContentEditorComponent],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {

}
