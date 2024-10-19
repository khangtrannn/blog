import { Component } from '@angular/core';
import { PostEntryComponent } from './post-entry/post-entry.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostEntryComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {

}
