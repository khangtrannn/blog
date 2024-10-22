import { Component, input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { Post } from '../../../core/post';

@Component({
  selector: 'app-post-entry',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './post-entry.component.html',
  styleUrl: './post-entry.component.scss'
})
export class PostEntryComponent {
  post = input.required<Post>();
}
